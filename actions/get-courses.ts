import { Category, Course } from "@prisma/client";
import { getProgress } from "./get-progress";
import db from "@/lib/db";

export type CourseWithProgressWithCategory = Course & {
    category: Category | null,
    chapters: {id: string} [],
    progress: number | null
}

type GetCourse =  {
    userId: string;
    title?: string;
    categoryId?: string;
};

export const getCourses = async ({
    userId,
    title,
    categoryId,
}: GetCourse): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                categoryId,
                title: {
                    contains: title
                }
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    }, 
                    select: {
                        id: true
                    }
                }, 
                purchases: {
                    where: {
                        userId
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });


        const coursesWithProgress: CourseWithProgressWithCategory [] = await Promise.all(
            courses.map(async course => {
               if(course.purchases.length === 0) {
                return {
                    ...course,
                    progress: null
                }
               }
            //    If user has purchase the course we want to display the progress of the course otherwise display the price of the course
               const progressPercentage = await getProgress(userId, course.id);
               return {
                ...course,
                progress: progressPercentage
               }
            })
        ) 
        return coursesWithProgress;
    }catch(err) {
        console.log("[GET_COURSES]",err);
        return [];
        
    }
}