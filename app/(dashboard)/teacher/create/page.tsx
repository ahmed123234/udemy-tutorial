'use client';
import * as z from 'zod'
import axios from 'axios'
import  { zodResolver }  from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link';
import toast from 'react-hot-toast';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required'}),
})

const CreateCourse = () => {
  const router = useRouter();
  const form  = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      title: ""
    }
  });

  const { isSubmitting, isValid } = form.formState;

  const onSumbit = async (values: z.infer<typeof formSchema>)  => {
    try {
      const response = await axios.post('/api/courses', values);
      router.push(`/teacher/courses/${response.data?.id}`);
      console.log(values);
      toast.success("Course created")
    } catch (err) {
      toast.error('Something went wrong')
    }
  }
  return (
    <div className="flex h-full max-w-5xl p-6 mx-auto md:items-center md:justify-center">
      <div className=''>
        <h1 className='text-2xl'>
          Name your course
        </h1>

        <p className='text-sm text-slate-600'>
          {/* using &apos; instead of ' */}
          What would you like to name your course? Don&apos;t worry, 
          you can change this later.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSumbit)}
            className='mt-8 space-y-8'
          >
            <FormField control={form.control} name='title' render={({field}) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 'Advanced  web development'" {...field}/>
                </FormControl>
                <FormDescription>
                  What will you teach in this course?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}/>

            <div className='flex items-center gap-x-2'>
              <Link  href='/'> 
                <Button
                  type='button'
                  variant={'ghost'}
                >
                  Cancel
                </Button>
              </Link>
              <Button type='submit' disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreateCourse