'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut} from 'next-auth/react'
import {User} from 'next-auth'
import { MessageSquareText } from 'lucide-react'
import { Button } from './ui/button'


const Navbar = () => {
  
    const {data: session} = useSession()

    const user: User = session?.user as User



  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70'>
        <nav className='mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8'>
             <a className='flex min-w-0 items-center gap-2.5 rounded-md text-sm font-semibold tracking-tight outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring/50 sm:text-base' href="#">
               <span
                 aria-hidden='true'
                 className='grid size-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground sm:size-8'
               >
                 <MessageSquareText className='size-4' />
               </span>
               <span className='min-w-0 truncate'>Mystry Message</span>
             </a>
             {
                session ? (
                    <div className='flex min-w-0 shrink-0 items-center justify-end gap-2 sm:gap-3'>
                      <span className='min-w-0 max-w-[9rem] truncate text-right text-xs text-muted-foreground sm:max-w-[18rem] sm:text-sm'>
                         Welcome, {user?.username || user?.email}
                      </span>
                      <span aria-hidden='true' className='hidden h-5 w-px shrink-0 bg-border sm:block' />
                      <Button
                        className='h-10 shrink-0 px-4 sm:h-8 sm:px-3.5'
                        onClick={() => signOut()}
                      >
                          Logout
                      </Button>
                    </div>
                ) : (
                
                    <Link href='/sign-in'>
                       <Button className='h-10 shrink-0 px-4 sm:h-8 sm:px-3.5'>Login</Button>
                   </Link>
                
                  
                )
             }
        </nav>
    </header>
  )
}

export default Navbar