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
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/format';

interface PriceFormProps {
    initialData: Course
    courseId: string
}
const formSchema = z.object({
    price: z.coerce.number()
});

const PriceForm = ({ initialData, courseId }: PriceFormProps ) => {

    const router = useRouter();

    const [ isEditing, setIsEditing ] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price :initialData?.price || undefined,
        }
    });
    

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {            
        try {
            if(values.price!== 0) {
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
            Course price

            <Button variant="ghost" onClick={toggleEdit}>
                {isEditing? (
                    <>
                        Cancel
                    </>
                ): (
                    <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit price
                    </>
                )}
            </Button>
       </div>
        {!isEditing && (
            <p className={cn(
                'text-sm mt-2',
                !initialData.price && "text-slate-500 italic"
            )}>
                {initialData.price ? formatPrice(initialData.price) 
                : 'No price'}
            </p>
        )}

        {isEditing && (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4 mt-4'
                >
                    <FormField 
                        name='price'
                        control={form.control}
                        render={({field}) => (
                            <FormControl>
                                <Input  
                                    type='number'
                                    step="0.01"
                                    disabled={isSubmitting}
                                    placeholder="Set a price for your course"
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

export default PriceForm