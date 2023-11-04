import IconBage from '@/components/IconBage';
import db from '@/lib/db';
import { auth } from '@clerk/nextjs'
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'
import ChapterTitleForm from './_components/ChapterTitleForm';
import ChapterDescriptionForm from './_components/chapter-description-from';
import ChapterAccessForm from './_components/chapter-access-from';
import ChapterVideoForm from './_components/chapter-video-form';
import Banner from '@/components/banner';
import ChapterActions from './_components/chapter-actions';

const ChapterIdPage = async ({params: {id: courseId, chapterId}}: { params: { id: string, chapterId: string}}) => {
  
  const { userId } = auth();

  
  if(!userId) return redirect("/");
  
  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId
    }, 
    include: {
      muxData: true
    }
  });


  if(!chapter) redirect("/");

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl
  ]

  const totalFields = requiredFields.length;
  const comptetedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${comptetedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner 
          lable='This chapter is unpublished. It will not be visible in the course' 
          variant="warning" 
        />
      )}
    
      <div className='p-6 '>
        <div className='items-center justify-between felx'>
            <div className='w-full'>
                <Link 
                  href={`/teacher/courses/${courseId}`}
                  className='flex items-center mb-6 text-sm transition hover:opacity-75'
                > 
                  <ArrowLeft className='w-4 h-4' />
                  Back to course setup
                </Link>

                <div className='flex items-center justify-between w-full'>

                  <div className='flex flex-col gap-y-2'>
                    <h1 className='text-2xl font-medium'>
                      Chapter Craetion
                    </h1>

                    <span className='text-sm text-slate-700'>
                        Complate all fields {completionText}
                    </span>
                  </div>
                  <ChapterActions 
                    disabled={!isComplete}
                    courseId={courseId}
                    chapterId={chapterId}
                    isPublished={chapter.isPublished}
                  />
                </div>
            </div>
        </div>
        <div className='items-start gap-6 mt-16 md:flex'>
            <div className='space-y-4 basis-full md:basis-1/2'>
                <div>
                  <div className='flex items-center gap-x-2'>
                      <IconBage icon={LayoutDashboard} />
                      <h2 className='text-xl'>
                        Customize your chapter
                      </h2>
                  </div>
                  
                  <ChapterTitleForm 
                    initialData={chapter}  
                    courseId={courseId} 
                    chapterId={chapterId}
                  />

                  <ChapterDescriptionForm 
                    initialData={chapter}  
                    courseId={courseId} 
                    chapterId={chapterId}
                  
                  />
                </div>
                {/* access setting for pubilshing the course descision */}
                <div>
                  <div className='flex items-center gap-x-2'>
                    <IconBage icon={Eye} />

                    <h2 className='text-xl'>
                      Access settings
                    </h2>
                  </div>
                  <ChapterAccessForm 
                    initialData={chapter}  
                    chapterId={chapterId} 
                    courseId={courseId}
                  />
                </div>
            </div>

            <div className='basis-1/2'>
              <div className='flex items-center gap-x-2'>
                <IconBage icon={Video} />

                <h2 className='text-xl '>
                  Add a video
                </h2> 
              </div>

              <ChapterVideoForm
                initialData={chapter}
                chapterId={chapterId}
                courseId={courseId}
              />

            
            </div>
        </div>
      </div>
    </>

  )
}

export default ChapterIdPage