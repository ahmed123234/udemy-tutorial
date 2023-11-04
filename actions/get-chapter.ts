import { Attachment, Chapter } from "@prisma/client";
import db from "@/lib/db";
interface GetChapterProps {
    userId: string;
    chapterId: string;
    courseId: string;
}

export const getChapter = async ({
    userId,
    chapterId,
    courseId
}: GetChapterProps) => {
    try {
        const purcahse = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true
            },
            select: {
                price: true
            }
        });

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true
            }
        });

        if(!chapter || !course) {
            throw new Error("Chapter or course is not found");
        }

        // fetch all of the following things if the user purchase the course
        let muxData = null;
        let attachments: Attachment [] = [];
        let nextChapter: Chapter | null = null;

        if(purcahse) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId
                }
            });
        }

        if(chapter.isFree || purcahse) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId
                }
            });

            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId,
                    isPublished: true,
                    position: {
                        gt: chapter.position 
                    }
                },
                orderBy: {
                    position: "asc"
                }
            });
        }

        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        });

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purcahse
        }


    } catch(err) {
        console.log("[GET_CHAPTER]", err);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null
        }
    }
}