"use client"

import { useToast } from '@/hooks/use-toast'
import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z as zod } from 'zod'
import { signIn } from 'next-auth/react'
import { ApiResponse } from '@/types/apiResponse'
import axios, { AxiosError } from 'axios'


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

export default function SignInForm() {

    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter();

    const { toast } = useToast();

    const register = useForm<zod.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    })

    async function onSubmit(data: zod.infer<typeof signInSchema>) {
        setIsSubmitting(true)

        //NOTE - (MINE Attampted Code) Sign in user with axios method
        // try {
        //     const response = await axios.post("/api/sign-in", {
        //         identifier: data.identifier,
        //         password: data.password
        //     })

        //     toast({
        //         title: response.data.success?.toString() || "Sign in successful",
        //         description: response.data.message || "Please wait...",
        //     })

        //     router.replace("/dashboard")

        // } catch (error) {
        //     console.log("Error signing in", error);
        //     const axiosError = error as AxiosError<ApiResponse>


        //     toast({
        //         title: axiosError.response?.data.success?.toString() || "Error signing in",
        //         description: axiosError.response?.data.message || "Please try again",
        //     })
        // }


        //NOTE - Sign in user with next/auth method
        const response = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        console.log(response);
        console.log(response?.url);


        if (response?.error) {
            setIsSubmitting(false)

            if (response.error === "CredentialsSignin") {
                toast({
                    title: "Error",
                    description: response.error || "Error signing in. Please try again",
                    variant: 'destructive'
                })
            } else {
                toast({
                    title: "Error",
                    description: response.error || "Error signing in. Please try again",
                    variant: 'destructive'
                })
            }
        }

        if (response?.ok) {
            setIsSubmitting(false)

            toast({
                title: "Success",
                description: response.ok || "Sign in successful. Please wait...",
            })

            if (response?.url) {
                router.replace("/dashboard")
            }
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
                        Sign In
                    </h1>
                    <p className="mb-4">Enter your sign in details</p>
                </div>


                <Form {...register}>
                    <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-6 text-black">

                        <FormField
                            name="identifier"
                            control={register.control}
                            render={({ field }) => (

                                <FormItem>

                                    <FormLabel
                                        className='text-gray-100'
                                    >
                                        Email/Username
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder="email/username"
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
                            {isSubmitting ? (
                                <>
                                    <Loader2
                                        className='mr-2 h-4 w-4 animate-spin'
                                    /> Please wait...
                                </>
                            ) : ("Sign In")}
                        </Button>
                    </form>
                </Form>


            </div>

        </div>
    )
}



/*



*/
