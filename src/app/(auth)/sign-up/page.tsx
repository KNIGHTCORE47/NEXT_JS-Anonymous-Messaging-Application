"use client"
import React, { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { z as zod } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signUpSchema } from '@/schemas/signUpSchema'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'

//TODO - BUG FIX: Route response error => message



export default function SignUpForm() {

    //NOTE - Check if user exists find by its username
    const [username, setUsername] = useState("")

    //NOTE- Debounced username
    const debounced = useDebounceCallback(setUsername, 2500)

    //NOTE - Check and hold/display of availability of username unique
    const [usernameMessage, setUsernameMessage] = useState("")

    //NOTE - Set a loader between backend requests for checking username unique
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)

    //NOTE- Set a loader between backend requests for submitting user information
    const [isSubmitting, setIsSubmitting] = useState(false)

    //NOTE - Use toast for frontend notifications
    const { toast } = useToast()

    //NOTE - Use router for navigation
    const router = useRouter()

    //NOTE - Sign up form structure from useForm
    const register = useForm<zod.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })


    useEffect(() => {
        async function checkUsernameUnique() {

            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage("")
            }

            try {
                const response = await axios.get(`/api/check-username-unique?username=${username}`)

                console.log(response);
                console.log(response.data);

                setUsernameMessage(response.data.message)

            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>

                //NOTE - Handle axios errors
                setUsernameMessage(
                    axiosError.response?.data.message ?? "Error checking if username is unique"
                )
            } finally {
                //NOTE - Set loading to false
                setIsCheckingUsername(false)
            }
        }

        checkUsernameUnique()

    }, [username])

    async function onSubmit(data: zod.infer<typeof signUpSchema>) {
        setIsSubmitting(true)

        try {
            const response = await axios.post<ApiResponse>("/api/sign-up", data)
            console.log(response);
            console.log(response.data);

            toast({
                title: response.data.success?.toString() || "Successfully signed up",
                description: response.data.message || "Check your email for verification code",
            })

            router.replace(`/verify/${username}`)

            setIsSubmitting(false)
        } catch (error) {
            console.error("Error signing up", error);
            const axiosError = error as AxiosError<ApiResponse>

            //NOTE - Handle axios errors
            toast({
                title: axiosError.response?.data.success?.toString() || "Error signing up",
                description: axiosError.response?.data.message || "Please try again",
                variant: 'destructive'
            })

            setIsSubmitting(false)
        }
    }



    return (
        <div
            className='flex justify-center items-center min-h-screen bg-zinc-900'
        >
            <div
                className='w-full max-w-md p-8 space-y-8 bg-black rounded-lg shadow-md text-white'
            >

                <div className="text-center">
                    <h1
                        className="text-xl font-bold tracking-tight lg:text-3xl mb-6"
                    >
                        Join Anonymous Message
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>

                <Form {...register}>
                    <form
                        onSubmit={register.handleSubmit(onSubmit)}
                        className="space-y-6 text-black"
                    >

                        <FormField
                            name="username"
                            control={register.control}
                            render={({ field }) => (

                                <FormItem>

                                    <FormLabel
                                        className='text-gray-100'
                                    >
                                        Username
                                    </FormLabel>

                                    <FormControl>
                                        <Input placeholder="username"
                                            {...field}
                                            onChange={event => {
                                                field.onChange(event)
                                                debounced(event.target.value)
                                            }}
                                        />
                                    </FormControl>

                                    {
                                        isCheckingUsername ? (
                                            <Loader2 className='animate-spin text-white' />

                                        ) : (
                                            username === "" ? (
                                                <FormDescription className='text-gray-400'
                                                >
                                                    This is your public display name.

                                                </FormDescription>
                                            ) : (
                                                <p
                                                    className={`text-sm mt-2 ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}
                                                >
                                                    {usernameMessage}
                                                </p>
                                            )
                                        )
                                    }
                                    <FormMessage />

                                </FormItem>

                            )}
                        />

                        <FormField
                            name="email"
                            control={register.control}
                            render={({ field }) => (

                                <FormItem>

                                    <FormLabel
                                        className='text-gray-100'
                                    >
                                        Email
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            type='email'
                                            placeholder="email"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormDescription
                                        className='text-gray-400'
                                    >
                                        This is your public email address.
                                    </FormDescription>

                                    <FormMessage />

                                </FormItem>

                            )}
                        />

                        <FormField
                            name="password"
                            control={register.control}
                            render={({ field }) => (

                                <FormItem>

                                    <FormLabel
                                        className='text-gray-100'
                                    >
                                        Password
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder="password"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />

                                </FormItem>

                            )}
                        />

                        <Button
                            className='bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300'
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2
                                            className='mr-2 h-4 w-4 animate-spin'
                                        /> Please wait...
                                    </>
                                ) : ("Sign up")
                            }
                        </Button>
                    </form>
                </Form>

                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-indigo-300 hover:text-indigo-400">
                            Sign in
                        </Link>
                    </p>
                </div>

            </div>

        </div>
    )
}




