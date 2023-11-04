import { isTeacher } from "@/actions/teacher";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId }  = auth();
        const { title } = await req.json();

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized request", { status: 401 })
        }

        const course = await db.course.create({
            data: {
                title,
                userId
            }
        });

        return NextResponse.json(course, { status: 201 })
    } catch(err: any) {
        console.error("[COURSES]", err.message);
        return new NextResponse('Internal Error', { status: 500 });
    }
}