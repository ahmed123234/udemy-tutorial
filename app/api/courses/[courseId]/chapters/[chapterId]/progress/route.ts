import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(req: Request, 
    {params: { courseId, chapterId }} : { params: { courseId: string, chapterId: string}}) {

    try {
        const { userId } = auth();
        const { isCompleted } = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            },
            update: {
                isCompleted: isCompleted
            },
            create: {
                userId,
                chapterId,
                isCompleted: isCompleted
            }
        });
        return NextResponse.json(userProgress);
    } catch(err) {
        console.log("[CHAPTER_ID_PROGRESS]");
        
        return new NextResponse("Error", { status: 500 });
    }
}