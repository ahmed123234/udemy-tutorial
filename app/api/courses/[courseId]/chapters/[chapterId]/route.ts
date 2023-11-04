import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from '@mux/mux-node'

const { Video } = new  Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!
)
export async function PATCH (req: Request, {params: {courseId, chapterId: id }}: {params: { courseId: string, chapterId: string }}) {
    try {
        const { userId } = auth();

        if(!userId)
            return new NextResponse("Unauthorized", { status: 401 });

        //we destruct the isPublished because of the chapter publishing will be controlled by a specific route
        // to prevent the user to publish the chapter without control 
        const { isPublished , ...body} = await req.json();

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });
        if(!courseId)
        return new NextResponse("Unauthorized", { status: 401 });

        const chapter = await db.chapter.update({
            where: {
                id,
                courseId
            },
            data: {
                ...body
            }
        });

        if(body.videoUrl) {
            // find existing mux data, so that if the user change the video then the mux data assets for video will also be updated
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: id
                }
            })

            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }

            const asset = await Video.Assets.create({
                input: body.videoUrl,
                playback_policy: "public",
                test: false
            })
    
    
            await db.muxData.create({
                data: {
                    chapterId: id,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0].id!
                }
            })
    
        }

        
        return NextResponse.json(chapter, { status: 200 });

    }catch(err: any) {
        console.error("COURSE_CHAPTER_ID: ", err);
        return new  NextResponse("Internal server error", { status: 500 });
    }
}


export async function DELETE (req: Request, {params: {courseId, chapterId: id }}: {params: { courseId: string, chapterId: string }}) {
    try {
        const { userId } = auth();

        if(!userId)
            return new NextResponse("Unauthorized", { status: 401 });

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });

        if(!courseId)
            return new NextResponse("Unauthorized", { status: 401 });

        const chapter = await db.chapter.findUnique({
            where: {
                id,
                courseId
            },
            include: {
                muxData: true
            }
        });

        if(!chapter) {
            return new NextResponse("Not Found", { status: 404 });
        }

        if(chapter.videoUrl) {

            if(chapter.muxData) {
                await Video.Assets.del(chapter.muxData.assetId);

                await db.muxData.delete({
                    where: {
                        id: chapter.muxData.id
                    }
                })
            }  
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id,
                courseId
            }
        });

        const publihedChaptersinCourse = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true
            }
        });

        if(!publihedChaptersinCourse.length) {
            // thre is no published chapters within the course so, you will not be allowed to publish the entire course
            // you are allowed to publish the course if it contains at least one chapter
            await db.course.update({
                where: {
                    id: courseId,
                    userId
                },
                data: {
                    isPublished: false
                }
            })
        }
 
        return NextResponse.json(deletedChapter, { status: 200 });

    } catch(err: any) {
        console.error("COURSE_CHAPTER_ID: ", err);
        return new  NextResponse("Internal server error", { status: 500 });
    }
}