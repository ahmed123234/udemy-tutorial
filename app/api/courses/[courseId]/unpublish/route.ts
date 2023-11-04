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
        });

        if(!course) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const unPublishedCourse = await db.course.update({
            where: {
                id: courseId,
            },
            data: {
                isPublished: false
            }
        });

        return NextResponse.json(unPublishedCourse, { status: 200 });

    } catch(err) {
        console.log("COURSE_UNPUPLISH", err);
        return new NextResponse("Internal server error", { status: 500 });
    }
}