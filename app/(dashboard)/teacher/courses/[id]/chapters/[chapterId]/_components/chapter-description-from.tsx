"use client"
import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod' 
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter } from '@prisma/client';

import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    Form
} from "@/components/ui/form"
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils';
import { Editor } from '@/components/ui/editor';
import { Preview } from '@/components/ui/preview';

interface ChapterDescriptionFormProps {
    initialData: Chapter
    courseId: string;
    chapterId: string;
}
const formSchema = z.object({
    description: z.string().min(1),
});

const ChapterDescriptionForm = ({ initialData, courseId, chapterId }: ChapterDescriptionFormProps ) => {

    const router = useRouter();

    const [ isEditing, setIsEditing ] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description :initialData?.description || '',
        }
    });
    

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {            
        try {
            if(values.description!== "") {
                const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            }
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
            Chapter Description

            <Button variant="ghost" onClick={toggleEdit}>
                {isEditing? (
                    <>
                        Cancel
                    </>
                ): (
                    <>
                        <Pencil className='w-4 h-4 mr-2' />
                        Edit Description
                    </>
                )}
            </Button>
       </div>
        {!isEditing && (
            <div className={cn(
                'text-sm mt-2 ql-container',
                !initialData.description && "text-slate-500 italic"
            )}>
                {!initialData?.description? 'No description': (
                    <Preview value={initialData.description} />
                )}
            </div>
        )}

        {isEditing && (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='mt-4 space-y-4'
                >
                    <FormField 
                        name='description'
                        control={form.control}
                        render={({field}) => (
                            <FormControl>
                                <Editor  
                                    {...field}
                                />
                            </FormControl>
                        )}
                    />

                    <div className='items-center felx gap-x-2'>
                        <Button
                            disabled={!isValid || isSubmitting}
                            type='submit'
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        )}
    </div>
  )
}

export default ChapterDescriptionForm