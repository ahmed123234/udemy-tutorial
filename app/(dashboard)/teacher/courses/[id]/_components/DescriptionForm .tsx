"use client"
import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod' 
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Course } from '@prisma/client';

import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    Form
} from "@/components/ui/form"
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface DescriptionFormProps {
    initialData: Course
    courseId: string
}
const formSchema = z.object({
    description: z.string().min(1, {
        message: "description is required"
    }),
});

const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps ) => {

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
                const response = await axios.patch(`/api/courses/${courseId}`, values);
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
            Course Description

            <Button variant="ghost" onClick={toggleEdit}>
                {isEditing? (
                    <>
                        Cancel
                    </>
                ): (
                    <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Description
                    </>
                )}
            </Button>
       </div>
        {!isEditing && (
            <p className={cn(
                'text-sm mt-2',
                !initialData.description && "text-slate-500 italic"
            )}>
                {initialData?.description || 'No description'}
            </p>
        )}

        {isEditing && (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4 mt-4'
                >
                    <FormField 
                        name='description'
                        control={form.control}
                        render={({field}) => (
                            <FormControl>
                                <Textarea  
                                    disabled={isSubmitting}
                                    placeholder="e.g. 'This course is about ...'"
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

export default DescriptionForm