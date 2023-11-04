import React from 'react'

function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <main className='flex items-center justify-center w-full h-full'>
        {children}
    </main>
  )
}

export default AuthLayout