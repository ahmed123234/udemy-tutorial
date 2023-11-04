import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(req: Request,  { params }: { params: { courseId: string, attachmentId: string } }) { 
    try {
        const { userId } = auth(); 
    
        if(!userId) return new NextResponse("Unauthorized", { status: 401});

        // check if the creator of this attachments is the owner of the course 
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if(!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

       const attachment =  await db.attachment.delete({
            where: {
                id: params.attachmentId,
                courseId: params.courseId
            }
        })
        
        return NextResponse.json(attachment, { status: 201 });
        
    } catch(err: any) {
        console.log("ATTACHMENT_ID", err.message)
        return new NextResponse("Internal server error", { status: 500});
    }   
    
}