"use client";

import { Layout, Compass, List, BarChart } from 'lucide-react'
import { SidebarItem } from ".";
import { usePathname } from 'next/navigation';

const guestRoutes = [
    {
        icon: Layout,
        label: 'Dashboard',
        href: '/'
    },
    {
        icon: Compass,
        label: 'Browse',
        href: '/search'
    },
];

const teacherRoutes = [
    {
        icon: List,
        label: "Cousres",
        href: "/teacher/courses"
    },
    {
        icon: BarChart,
        label: 'Analytics',
        href: '/teacher/analytics'
    },

] 

const SidebarRoutes = () => {

    const pathname = usePathname();

    const isTeacherPage = pathname?.includes('/teacher');

    const routes = isTeacherPage? teacherRoutes: guestRoutes;
  return (
    
        <div className="flex-col w-full felx">
         
            {routes.map(({ icon, label, href }, index) => (
                <SidebarItem  key={href} icon={icon} label={label} href={href}/>
            ))}

        </div>
    )
}

export default SidebarRoutes