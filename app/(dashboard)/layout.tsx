import { Sidebar, Navbar } from "./_components"

const layout = ({ children } : { children: React.ReactNode}) => {
   
  return (
    <main className='h-full'>
        <div className='h-[80px] md:pl-56 fixed inset-y-0 w-full z-50'>
          <Navbar />
        </div>
        <div className="fixed inset-y-0 z-50 flex-col hidden w-56 h-full md:flex">
           <Sidebar />
        </div>
        <div className="h-full md:pl-56 pt-[80px]">
          {children}
        </div>
    </main>
  )
}

export default layout