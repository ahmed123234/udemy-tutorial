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

        const unPublishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId
            },
            data: {
                isPublished: false
            }
        });

        // check if the unpublished chapter was the only published one within the course

        const publihedChaptersinCourse = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true
            }
        });
        // unpublish the course if there is no more published chapters within it.
        if(!publihedChaptersinCourse.length) {
            await db.course.update({
                where: {
                    id: courseId,
                    userId
                },
                data: {
                    isPublished: false
                }
            });
        }

        return NextResponse.json(unPublishedChapter, { status: 200 });

    } catch(err) {
        console.log("CHAPTER_UNPUPLISH", err);
        return new NextResponse("Internal server error", { status: 500 });
    }
}