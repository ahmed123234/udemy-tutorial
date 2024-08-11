"use client"
import { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter, Course, MuxData } from '@prisma/client';
import { VideoIcon, Pencil, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ChapterVideo from 'next/image';
import FileUpload from '@/components/FileUpload';
import { z } from 'zod';
import MuxPlayer from '@mux/mux-player-react'

interface ChapterVideoFormProps {
    initialData: Chapter & {muxData?: MuxData | null},
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    videoUrl: z.string().min(1),
})

const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps ) => {

    const router = useRouter();

    const [ isEditing, setIsEditing ] = useState<boolean>(false);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {            
        try {
            
            const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            
            toast.success("Chapter updated");
            toggleEdit();
            // refresh the page after updating the course
            // and refresh the server component and the database
            router.refresh();
        } catch(err) {
            toast.error('Something went wrong')
        }
    }

    const toggleEdit = () => setIsEditing(current => !current);


  return (
    <div className='p-4 mt-6 border rounded-md bg-slate-100'>
       <div className='flex items-center justify-between font-medium'>
            Chapter Video

            <Button variant="ghost" onClick={toggleEdit}>
                {isEditing ? (
                    <>
                        Cancel
                    </>
                ): !isEditing && !initialData.videoUrl?
                (
                    <>
                        <PlusCircle className='w-4 h-4 mr-2' />
                        Add a Video
                    </>
                ): 
                (
                    <>
                        <Pencil className='w-4 h-4 mr-2' />
                        Edit Video
                    </>
                )}
            </Button>
       </div>
        {!isEditing && (
           !initialData.videoUrl ? (
            <div className='flex items-center justify-center rounded-md h-60 bg-slate-200'>
                <VideoIcon  className='w-10 h-10 text-slate-400'/>
            </div>
           ) : (
            <div className='relative mt-2 aspect-video'>
                {/* proccess the video and creatinf=g a proper mux assets */}
                <MuxPlayer
                    playbackId={initialData?.muxData?.playbackId || ""}
                
                />
            </div>
           )
        )}

        {isEditing && (
          <div>
            <FileUpload 
                onChange={(url) => {
                    if(url) {
                    onSubmit({ videoUrl: url })
                    }
                }} 
                endpoint='chapterVideo' 
            />

            <div className='mt-4 text-es text-muted-foreground'>
                Upload this chapter's video
            </div>
          </div>
        )}
        {initialData.videoUrl && !isEditing && (
            <div className='mt-2 text-sm text-muted-foreground'>
                Videos can take a few minutes to proccess. 
                Refresh the page if  video does
                not appear.
            </div>
        )}
    </div>
  )
}

export default ChapterVideoForm