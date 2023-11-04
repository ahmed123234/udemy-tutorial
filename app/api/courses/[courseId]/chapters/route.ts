import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST (req: Request, { params: { courseId } } : { params: { courseId: string }}) {
    try {

         const { userId } = auth();

         const body = await req.json();

         if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
         }

        // check if we are the owner of the course or not

        const isCourseOwner = db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });

        if(!isCourseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId
            },
            orderBy: {
                position: "desc"
            }
        });

        let chapterPostion = lastChapter? lastChapter.position + 1 : 1;

         const chapter = await db.chapter.create({
            data: {
                courseId,
                title: body.title,
                position: chapterPostion
            }
         });

         return NextResponse.json(chapter, { status: 201 });

    } catch (err: any) {
        console.log("CHAPTER: ", err.message );
        return new NextResponse("Internal server error", { status: 500 });
    }
}