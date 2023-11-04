"use client"
import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod' 
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter, Course } from '@prisma/client';

import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    Form
} from "@/components/ui/form"
import {  Loader2, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import ChaptersList from './ChaptersList ';

interface ChapterFormProps {
    initialData: Course & { chapters:  Chapter [] }
    courseId: string
}
const formSchema = z.object({
    title: z.string().min(1),
});


const ChapterForm = ({ initialData, courseId }: ChapterFormProps ) => {

    const router = useRouter();

    const [ isCreating, setIsCreating ] = useState<boolean>(false);
    const [ isUpdating, setIsUpdating ] = useState<boolean>(false);


    const toggleEdit = () => setIsUpdating(current => !current);

    const toggleCreating = () => setIsCreating(current => !current);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title : '',
        }
    });
    

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {            
        try {
            if(values.title!== "") {
                const response = await axios.post(`/api/courses/${courseId}/chapters`, values);
            }
            toast.success("Chapter created");
            toggleCreating();
            // refresh the page after updating the course
            // and refresh the server component and the database
            router.refresh();
        } catch(err) {
            toast.error('Something went wrong')
        }
    }

    const onReOrder = async (updateData: {id: string, position: number} []) => {
        try {
            setIsUpdating(true);

            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            })

            toast.success("Chapters Reorderd");
            router.refresh();
        } catch(err) {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`);
    }

  return (
    <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
        {isUpdating && (
            <div className='absolute h-full w-full top-0 right-0 flex items-center rounded-md justify-center bg-slate-500/20'>
                <Loader2  className=' animate-spin h-6 w-6 text-sky-700'/>
            </div>
        )}
       <div className='font-medium flex items-center justify-between'>
            Course Chapters

            <Button variant="ghost" onClick={toggleCreating}>
                {isCreating? (
                    <>
                        Cancel
                    </>
                ): (
                    <>
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Add a chapter
                    </>
                )}
            </Button>
       </div>
        
        {isCreating && (
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
                                    placeholder="e.g. 'Introduction to the course'"
                                    {...field}
                                />
                            </FormControl>
                        )}
                    />

                    <Button
                        disabled={!isValid || isSubmitting}
                        type='submit'
                    >
                        Create
                    </Button>
                </form>
            </Form>
        )}
        {!isCreating && (
            <div className={cn(
                "text-sm mt-2",
                !initialData.chapters.length && 'text-slate-500 italic' 
            )}>
                {!initialData.chapters.length ? "No chapters":(
                    // TODO: Add a list of chapters
                    <ChaptersList 
                        onEdit={onEdit}
                        onReOrder={onReOrder}
                        items={initialData.chapters || []}
                    />
                )}
            </div>
        )}

        {!isCreating && (
            <p className='text-xs text-muted-foreground mt-4'>
                Drag and drop to reorder the chapters
            </p>
        )}
    </div>
  )
}

export default ChapterForm