"use client"
import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod' 
import { toast } from 'react-hot-toast'
// import { db } from '@/lib/db'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
interface ChapterProps {
    initialData: Chapter,
    chapterId: string,
    courseId: string
}
const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required"
    }),
});

const ChapterTitleForm = ({ initialData, chapterId, courseId }: ChapterProps ) => {

    const router = useRouter();

    const [ isEditing, setIsEditing ] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title :initialData?.title || '',
        }
    });
    

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.log(values);
            
        try {
            if(values.title!== "") {
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
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
       <div className='font-medium flex items-center justify-between'>
            Chapter Title

            <Button variant="ghost" onClick={toggleEdit}>
                {isEditing? (
                    <>
                        Cancel
                    </>
                ): (
                    <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Title
                    </>
                )}
            </Button>
       </div>
        {!isEditing && (
            <p className='text-sm mt-2'>
                {initialData.title}
            </p>
        )}

        {isEditing && (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4 mt-4'
                >
                    <FormField 
                        name='title'
                        control={form.control}
                        render={({field}) => (
                            <FormControl>
                                <Input  
                                    disabled={isSubmitting}
                                    placeholder="e.g. Introduction to the course'"
                                    {...field}
                                />
                            </FormControl>
                        )}
                    />

                    <div className='felx items-center gap-x-2'>
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

export default ChapterTitleForm