import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import  Mux from '@mux/mux-node'
import { isTeacher } from "@/actions/teacher";

const { Video } = new Mux(
    process.env.MUX__TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!
);

export async function DELETE (req: Request, { params: { courseId } }:
     {params: {courseId: string}}) {
    try {
        const  { userId } = auth();

        if(!userId || isTeacher(userId)) {
            return new NextResponse('Unauthorized to access the resource', { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });

        if(!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        // delete assets for mux
        course.chapters.forEach(async (chapter) => {

            if(chapter?.isPublished && chapter.muxData?.assetId) {
                await Video.Assets.del(chapter.muxData.assetId);
            }
        })
        
        // all the chapters and muxdata witll be deleted automaticly beacuse of the cascadeing delete definded on prisma
        
        const deletedCourse = await db.course.delete({
            where: {
                id: courseId,
                userId
            },
        });

        return NextResponse.json(deletedCourse, { status: 200 });

    } catch(err: any) {
        console.log("[COURSE_ID_DELETE]", err.message)
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function PATCH (req: Request, { params: { courseId } }: {params: {courseId: string}}) {
    try {
        const  { userId } = auth();

    if(!userId || isTeacher(userId)) {
        return new NextResponse('Unuthorized to access the resource', { status: 401 });
    }

    const body = await req.json();

    const course = await db.course.update({
        where: {
            id: courseId,
            userId
        },
        data: {
            ...body
        }
    })

    return NextResponse.json(course, { status: 200 });
    } catch(err: any) {
        console.log("[COURSE_ID_UPDATE]", err.message)
        return new NextResponse('Error updating the course specified', { status: 500 });
    }
}