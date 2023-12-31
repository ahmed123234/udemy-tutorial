import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request,
     { params: { courseId, chapterId } }
     : { params: {courseId: string, chapterId: string }}) {
    try { 

        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });

        if(!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId
            },
            include: {
                muxData: true
            }
        });

        // const muxData = await db.muxData.findUnique({
        //     where: {
        //         chapterId
        //     }
        // });

        if(!chapter || !chapter.muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse('Missing required fields',{status: 400});
        }

        const publishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(publishedChapter, { status: 200 });

    } catch(err) {
        console.log("CHAPTER_PUPLISH", err);
        return new NextResponse("Internal server error", { status: 500 });
    }
}