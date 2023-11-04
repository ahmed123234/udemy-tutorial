"use client"

import { Button } from "@/components/ui/button"
import { Course } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu'
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// const columnsSchema = z.object({
//     id: z.string(),
//     amount: z.number(),
//     status: z.string(),
//     email: z.string()
// });

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Price
            <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
    ), 
    cell: ({row}) => {
        const price = parseFloat(row.getValue('price')) || 0;
        const formated = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price)
        return (
           <>
            {formated}
           </>
        )

    }
  },
  {
    accessorKey: "isPublished",
    header: ({column}) => (
        
        <Button 
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}    
        >
            Published
            <ArrowUpDown  className="w-4 h-4 ml-2"/>
        </Button>

    ), 
    cell: ({ row }) => {
        const isPublished = row.getValue('isPublished') || false;
        return (
            <Badge 
                className={cn(
                    " bg-slate-500",
                    isPublished && "bg-sky-700"
                )}
            >
                {isPublished? "Published" : "Draft"}
            </Badge>
        )

    }
  },
//   TODO :add action to individual course (update, delete, ...) 
{
    id: "actions",
    cell: ({ row }) => {
        const { id } = row.original;
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost'  className="w-8 h-4 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="w-4 h-4"/>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <Link href={`/teacher/courses/${id}`}>
                        <DropdownMenuItem className="flex items-center w-24 gap-x-2">
                            <Pencil  className="w-4 h-4 ml-2"/>
                            Edit
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        ) 
    }
}
]
