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
import { Combobox } from '@/components/Combobox';

interface DescriptionFormProps {
    initialData: Course
    courseId: string,
    options: {
        label: string;
        value: string;
    } [];
}
const formSchema = z.object({
    categoryId: z.string().min(1, {
        message: "category is required"
    }),
});

const CategoryForm = ({ initialData, courseId, options }: DescriptionFormProps ) => {

    const router = useRouter();

    const [ isEditing, setIsEditing ] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId :initialData?.categoryId || '',
        }
    });
    

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {            
        try {
            if(values.categoryId!== "") {
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

    const selectedOption = options.find(option => option.value === initialData?.categoryId)
    console.log("selected option", selectedOption);
    
  return (
    <div className='p-4 mt-6 border rounded-md bg-slate-100'>
       <div className='flex items-center justify-between font-medium'>
            Course Category

            <Button variant="ghost" onClick={toggleEdit}>
                {isEditing? (
                    <>
                        Cancel
                    </>
                ): (
                    <>
                        <Pencil className='w-4 h-4 mr-2' />
                        Edit Category
                    </>
                )}
            </Button>
       </div>
        {!isEditing && (
            <p className={cn(
                'text-sm mt-2',
                !initialData.categoryId && "text-slate-500 italic"
            )}>
                {selectedOption?.label || 'No category'}
            </p>
        )}

        {isEditing && (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='mt-4 space-y-4'
                >
                    <FormField 
                        name='categoryId'
                        control={form.control}
                        render={({field}) => (
                            <FormControl>
                                <Combobox options={...options}  onChange={field.onChange} />
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

export default CategoryForm