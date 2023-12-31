import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import db from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
 
const TeacherCourses = async () => {

  const { userId } = auth();
  
  if(!userId) redirect("/"); 

  const data = await db.course.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return (
    <div className='p-6'>
      {/* <Link  href='/teacher/create'>
        <Button>
          New Course
        </Button>
      </Link> */}
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default TeacherCourses