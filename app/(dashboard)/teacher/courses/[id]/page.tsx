import IconBage from '@/components/IconBage';
import db from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'
import TitleForm from './_components/TitleForm';
import DescriptionForm from './_components/DescriptionForm ';
import ImageForm from './_components/ImageForm';
import { Combobox } from '@/components/Combobox';
import CategoryForm from './_components/CategoryForm';
import PriceForm from './_components/PriceForm';
import AttachmentForm from './_components/AttachmentForm';
import ChapterForm from './_components/ChapterForm';
import CourseActions from './_components/course-actions';
import Banner from '@/components/banner';
const Course = async ({params: { id } }: { params: { id: string } }) => {

    const { userId } = auth();

    if(!userId) {
        redirect('/');
    }

    console.log("id is ", id)
    const courseInfo = await db.course.findUnique({
        where: {
            id,
            userId //so that the creator of the course can fetch the course
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc"
                }
            },
            attachemnts: {
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    });


    const categories = await db.category.findMany( {
        orderBy: {
            name: "asc"
        }
    });

    // redirect if the user is not the owner of the course
    if(!courseInfo) redirect('/')

    const { title, description, imgUrl, price, categoryId, id: courseId, attachemnts, chapters } = courseInfo;
    const requiredFields = [
        title,
        description,
        imgUrl,
        price,
        categoryId,
        // attachemnts,
        chapters.some((chapter) => chapter.isPublished)
        
    ]

    const totalFields = requiredFields.length;
    // get the number of completed fieldss
    const complatedFields = requiredFields.filter(Boolean).length;
    const compleationText = `(${complatedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);
    
  return (
    <>
        {!courseInfo.isPublished && (
            <Banner 
                variant="warning" 
                label='This course is unpublished. It will not be visible to the related students'
            />
        )}    
        <div className='p-6'>
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
                <h1 className='text-2xl font-medium'>
                    Course setup
                </h1>

                <span className='text-sm text-slate-700'>
                    Complate all fields {compleationText}
                </span>
            </div>
            <CourseActions courseId={id} disabled={!isComplete} isPublished={courseInfo.isPublished} />
        </div>

        <div className='grid-cols-1 gap-6 mt-16 md:flex md:items-start'>
            <div className='md:basis-1/2'>
                <div className='flex items-center gap-x-2'>
                    <IconBage icon={LayoutDashboard}  />

                    <h2 className='text-xl '>Customize your course</h2>
                </div>

                <TitleForm  initialData={courseInfo} courseId={courseId}/>
                <DescriptionForm  initialData={courseInfo} courseId={courseId}/>
                <ImageForm  initialData={courseInfo} courseId={courseId}/>
                <CategoryForm initialData={courseInfo} courseId={courseId} 
                    options={categories.map(({id, name}) => (
                        {
                            label: name,
                            value: id
                        }
                    ))}
                 />
            </div>
            <div className='flex flex-col gap-3 mt-6 mb-6 space-y-6 md:space-y-0 md:mt-0 md:mb-0 md:basis-1/2'>
                <div>
                    <div className='flex items-center gap-x-2'>
                            <IconBage icon={ListChecks}  />
                            <h2 className='text-xl'>
                                Course chapters
                            </h2>
                    </div>

                    <ChapterForm initialData={courseInfo} courseId={courseId} />
                </div>

                <div>
                    <div className='flex items-center gap-x-2'>
                        <IconBage icon={CircleDollarSign} />
                        <h2 className='text-xl'>Sell your course</h2>
                    </div>
                    <PriceForm  initialData={courseInfo} courseId={courseId}/>
                </div>

                <div>
                    <div className='flex items-center gap-x-2'>
                        <IconBage icon={File} />
                        <h2 className='text-xl'>Reasources & Attachments</h2>
                    </div>
                    <AttachmentForm  initialData={courseInfo} courseId={courseId}/>
                </div>
            </div>
        
        </div>
        </div>
    </>
  )
}

export default Course