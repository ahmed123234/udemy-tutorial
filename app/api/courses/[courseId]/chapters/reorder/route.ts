import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT (req: Request, {params: { courseId }}:
     { params: { courseId: string }}) {
    try {

        const { userId } = auth();

        const { list } = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOnwer = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });

        if(!courseOnwer) 
            return new NextResponse("Unauthorized", { status: 401 });

        list.forEach(async ({id, position}: { id: string, position: number}) => {
            await db.chapter.update({
                where: {
                    id
                },
                 data: {
                    position
                 }
            })
        });

        return new NextResponse("Success", { status: 200 });

    } catch(err: any) {
        console.log("CHAPTERS_REORDER: ", err.message);
        
        return new NextResponse("Internal server error", { status: 500 });
    }
}