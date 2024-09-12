"use client"

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { User } from 'next-auth'
import { Button } from '../ui/button'

export default function Navbar() {

    //NOTE - Get session detailes from next-auth
    const { data: session } = useSession()

    //NOTE - Get user details from User object. Inside session data we have parse the user info which finally parse the values to the next-auth User object.
    const user: User = session?.user

    //NOTE - Check if user is authenticated/has session data
    const isAuthenticated = user !== undefined

    return (
        <nav
            className='bg-gray-600 p-4 md:p-6 shadow-md text-white'
        >
            <div
                className='container mx-auto flex flex-col
            md:flex-row justify-between items-center'
            >
                <a
                    className='text-xl text-center font-bold mb-4 md:mb-0'
                    href="#"
                >
                    Anonymous
                    <br />
                    Message
                </a>

                {isAuthenticated ? (
                    <>
                        <span className='mr-4'>
                            Welcome {user?.username || user?.email}
                        </span>

                        <Button
                            className='w-full bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors duration-300 md:w-auto'
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            Sign Out
                        </Button>
                    </>
                ) : (
                    <Link href="/sign-in">
                        <Button className='w-full bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors duration-300 md:w-auto'>
                            Sign In
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    )
}


