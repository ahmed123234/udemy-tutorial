"use client";
import { UserButton, auth, useAuth } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import Link from 'next/link';
import SearchInput from './search-input';
import { isTeacher } from '@/actions/teacher';

const NavbarRoutes = () => {
    const pathname = usePathname();
    const { userId } = useAuth();
    
    const isTeacherPage = pathname?.startsWith('/teacher');
    const isPlayerPage = pathname.includes('/courses');
    const isSearchPage = pathname === '/search'
    return (
      <>
        {isSearchPage && (
            <div className='hidden md:block'>
                <SearchInput />
            </div>
        )}
        <div className='flex ml-auto gap-x-2'>
            {
                isTeacherPage || isPlayerPage ? (
                    
                    <Link href={"/"}>
                        <Button variant={'outline'}>
                            <LogOut className='w-4 h-4 mr-2' />
                            Exit
                        </Button>
                    </Link>

                ): isTeacher(userId!)? (

                    <Link href='/teacher/courses'>
                        <Button size={'sm'} variant={'ghost'}>
                            Teacher mode
                        </Button>
                    </Link>
                ): null
            }

            <UserButton afterSignOutUrl='/' />
        </div>
      </>
    )
}
export default NavbarRoutes;