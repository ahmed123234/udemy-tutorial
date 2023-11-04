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
    Form,
    FormDescription
} from "@/components/ui/form"
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Editor } from '@/components/ui/editor';
import { Preview } from '@/components/ui/preview';

interface ChapterQFormProps {
    initialData: Chapter
    courseId: string;
    chapterId: string;
}
const formSchema = z.object({
    isFree: z.boolean().default(false),
});

const ChapterAccessForm = ({ initialData, courseId, chapterId }: ChapterQFormProps ) => {

    const router = useRouter();

    const [ isEditing, setIsEditing ] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: !!initialData.isFree, //or Boolean(initialData.isFree);
        }
    });
    

    const { isSubmitting, isValid } = form.formState;

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
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
       <div className='font-medium flex items-center justify-between'>
            Chapter Access

            <Button variant="ghost" onClick={toggleEdit}>
                {isEditing? (
                    <>
                        Cancel
                    </>
                ): (
                    <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Access 
                    </>
                )}
            </Button>
       </div>
        {!isEditing && (
            <div className={cn(
                'text-sm mt-2 ql-container',
                !initialData.isFree && "text-slate-500 italic"
            )}>

                {initialData.isFree ? (
                    <>This chapter is free for preview</>
                ): <>This chapter is not free. </>}
            
            </div>
        )}

        {isEditing && (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4 mt-4'
                >
                    <FormField 
                        name='isFree'
                        control={form.control}
                        render={({field}) => (
                            <FormItem
                                className='space-y-0 rounded-md border p-4 flex flex-row items-start space-x-3'
                            >
                                <FormControl>
                                    <Checkbox 
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormDescription>
                                        Check this box if you want to make this chapter is free for preview 
                                    </FormDescription>
                                </div>
                            </FormItem>
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

export default ChapterAccessForm