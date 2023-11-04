import NavbarRoutes  from '@/components/NavbarRoutes';
import { MobileSidebar } from '.'

const Navbar = () => {
    return (
        <div className='flex items-center h-full p-4 bg-white border-b shadow-sm'>
            <MobileSidebar />
            <NavbarRoutes />
        </div>
    )
}

export default Navbar;