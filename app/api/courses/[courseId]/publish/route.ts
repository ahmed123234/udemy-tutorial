import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request,
     { params: { courseId } }
     : { params: {courseId: string }}) {
    try { 

        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
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
            return new NextResponse("Not Found", { status: 404 });
        }


        if(
            !course.chapters.length || 
            !course.chapters.some(chapter => chapter.isPublished === true) ||
            !course.title || !course.description || !course.imgUrl || !course.categoryId) {
            return new NextResponse('Missing required fields',{status: 400});
        }

        const publishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(publishedCourse, { status: 200 });

    } catch(err) {
        console.log("COURSE_PUPLISH", err);
        return new NextResponse("Internal server error", { status: 500 });
    }
}