'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from "next-auth"
import { Button } from './ui/button'

const Navbar = () => {

    const { data: session } = useSession();
    // data user k session mai se lena hai

    // assertion krna pdta hai jb b error aata hai
    const user: User = session?.user as User


    return (
        <nav className='p-2 md:p-4 shadow-md'>
            <div className='w-11/12 max-auto container mx-auto flex flex-col
            md:flex-row justify-between items-center'>
                <a href='#'>Mystry Message</a>
                {
                    session ? (
                        <>
                            <span className=' mr-4'>
                                Welcome, {user?.username || user?.email}
                            </span>
                            <Button onClick={() => signOut}
                                className='w-full md:w-auto'
                            >
                                Log out
                            </Button>
                        </>

                    ) : (
                        <Link href={"/sign-in"}>
                            <Button
                                className='w-full md:w-auto bg-white text-black hover:bg-gray-300'
                            >
                                Log in
                            </Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar
