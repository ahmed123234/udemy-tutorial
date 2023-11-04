import db from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseWithProgressWithCategory = Course & {
    // course: Course;
    category: Category;
    chapters: Chapter [];
    progress: number | null;
}

type DashboardCourses = {
    completedCourses: CourseWithProgressWithCategory [];
    coursesInProgress: CourseWithProgressWithCategory [];  
}

export const getDashboardCourses =  async (userId: string): 
Promise<DashboardCourses> => {
    try {
        const purchasedCourses = await db.purchase.findMany({
            where: {
                userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true
                            }
                        },
                    }
                }
            }
        });
        // Get all the chapters and calculate the progress for each of them
        const courses = purchasedCourses.map((purchase) => purchase.course) as 
        CourseWithProgressWithCategory[];

        for(let course of courses) {
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;
        }

        const completedCourses = courses.filter(course => course.progress === 100);
        // if course.progress is equal null make it 0 (using ??)
        const coursesInProgress = courses.filter(course => (course.progress ?? 0) < 100);

        return {
            completedCourses,
            coursesInProgress
        }
    } catch(err) {
        console.error("[GET_DASHBOARD_COURSES]", err);
        return {
            completedCourses: [],
            coursesInProgress: []
        }
        
    }
}