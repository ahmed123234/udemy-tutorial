"use client"
import { Category } from '@prisma/client'
import React from 'react'
import {
    FcEngineering,
    FcFilmReel,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode
 } from 'react-icons/fc'

import { IconType } from 'react-icons'
import CategoryItem from './category-item '

interface CategoriesProps {
    items: Category [];
}

const iconMap: Record<Category["name"], IconType> = {
    "Music": FcMusic,
    "Engineering": FcEngineering,
    "Photography": FcOldTimeCamera,
    "Fitness": FcSportsMode,
    "Accounting": FcSalesPerformance,
    "Computer Science": FcMultipleDevices,
    "Filming": FcFilmReel,
};

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className='flex items-center gap-x-2 overflow-x-auto pb-2'>
        {items.map(({id, name}) => (
            <CategoryItem  key={id} label={name} icon={iconMap[name]} value={id}/>
        ))}
    </div>
  )
}

export default Categories