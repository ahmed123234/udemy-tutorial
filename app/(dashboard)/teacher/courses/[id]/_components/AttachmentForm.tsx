"use client"
import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios';
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Attachment, Course } from '@prisma/client';
import { ImageIcon, FileIcon,  Pencil, PlusCircle, File, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/FileUpload';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import db from '@/lib/db';

interface AttachmentFormProps {
    initialData: Course & { attachemnts: Attachment[]},
    courseId: string
}



const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps ) => {

    const formSchema = z.object({
        url: z.string().min(1)
    });

    const [deletingId, setDeletingId]  = useState<string>("");
    
    const router = useRouter();

    const [ isEditing, setIsEditing ] = useState<boolean>(false);

    const handleDelete = async (id: string) => {

        try {
            setDeletingId(id)
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success('Attachment deleted');
            router.refresh();
        }catch(err: any) {
            console.log(err.message);
            toast.error('Something went wrong')
            
        } finally {
            setDeletingId("");
        }
    }

    const onSubmit = async (values: {url: string}) => {            
        try {
            if(values.url!== "") {
                const response = await axios.post(`/api/courses/${courseId}/attachments`, values);
            }
            toast.success("Course updated");
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
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
       <div className='font-medium flex items-center justify-between'>
            Course Attachments

            <Button variant="ghost" onClick={toggleEdit}>
                {isEditing ? (
                    <>
                        Cancel
                    </>
                ):
                (
                    <>
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Add a file
                    </>
                )
                }
            </Button>
       </div>
        {!isEditing && (
             <>
                {initialData.attachemnts.length === 0? (
                    <p className='test-sm mt-2 text-slate-500 italic'>
                        No attachemnts yet
                    </p>
                ): (
                    <div className='space-y-6'>
                        {initialData.attachemnts.map(attachment => (
                            <div    
                                key={attachment.id} 
                                className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
                            >
                                <File className='h-4 w-4 mr-4 flex-shrink-0'/>
                                <p className=' line-clamp-1 text-xs'>
                                    {attachment.name}
                                </p>

                                {deletingId === attachment.id? (
                                    <div className='ml-auto'>
                                        <Loader2 className='h-4 w-4 animate-spin'/>
                                    </div>
                                ): (
                                    <button
                                    className='ml-auto hover:opacity-75 transition'
                                        onClick={() => handleDelete(attachment.id)}
                                    >
                                        <X className='h-4 w-4'/>
                                    </button>
                                )}
                                
                            </div>
                        ))}
                    </div>
                )}
             </>
        )}

        {isEditing && (
          <div>
            <FileUpload 
                onChange={(url) => {
                    if(url) {
                        onSubmit({ url })
                    }
                }} 
                endpoint='courseAttachment' 
            />

            <div className='text-es text-muted-foreground mt-4'>
                Add anything to students might need to complete the course.
            </div>
          </div>
        )}
    </div>
  )
}

export default AttachmentForm