"use client"
import { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Course } from '@prisma/client';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image';
import FileUpload from '@/components/FileUpload';

interface ImageFormProps {
    initialData: Course,
    courseId: string
}


const ImageForm = ({ initialData, courseId }: ImageFormProps ) => {

    const router = useRouter();

    const [ isEditing, setIsEditing ] = useState<boolean>(false);

    const onSubmit = async (values: {imgUrl: string}) => {            
        try {
            if(values.imgUrl!== "") {
                const response = await axios.patch(`/api/courses/${courseId}`, values);
            }
            toast.success("Course updated");
            toggleEdit();
            // refresh the page after updating the course
            // and refresh the server component and the database
            router.refresh();
        } catch(err) {
            toast.error('Womething went wrong')
        }
    }

    const toggleEdit = () => setIsEditing(current => !current);


  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
       <div className='font-medium flex items-center justify-between'>
            Course Image

            <Button variant="ghost" onClick={toggleEdit}>
                {isEditing ? (
                    <>
                        Cancel
                    </>
                ): !isEditing && !initialData.imgUrl?
                (
                    <>
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Add an image
                    </>
                ): 
                (
                    <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Image
                    </>
                )}
            </Button>
       </div>
        {!isEditing && (
           !initialData.imgUrl ? (
            <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                <ImageIcon  className='h-10 w-10 text-slate-400'/>
            </div>
           ) : (
            <div className='relative aspect-video mt-2'>
                <Image 
                    src={initialData.imgUrl} 
                    alt='upload' 
                    className='object-contain'
                    fill
                    // width={} height={}
                />
            </div>
           )
        )}

        {isEditing && (
          <div>
            <FileUpload 
                onChange={(url) => {
                    if(url) {
                    onSubmit({ imgUrl: url })
                    }
                }} 
                endpoint='courseImage' 
            />

            <div className='text-es text-muted-foreground mt-4'>
                16:9 aspect ratio recommended
            </div>
          </div>
        )}
    </div>
  )
}

export default ImageForm