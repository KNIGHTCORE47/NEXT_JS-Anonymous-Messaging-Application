"use client"

import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z as zod } from 'zod'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


export default function verifyAccount() {

    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast()

    const register = useForm<zod.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            verifyCode: "",
        }
    })


    async function onSubmit(data: zod.infer<typeof verifySchema>) {
        try {
            const response = await axios.post("/api/verify-code", {
                username: params.username,
                code: data.verifyCode
            })

            toast({
                title: response.data.success?.toString() || "Verify account successful",
                description: response.data.message || "Please login to continue",
            })

            router.replace("/sign-in")

        } catch (error) {

            console.error("Error verifying account", error);
            const axiosError = error as AxiosError<ApiResponse>

            //NOTE - Handle axios errors
            toast({
                title: axiosError.response?.data.success?.toString() || "Error verifying account",
                description: axiosError.response?.data.message || "Please try again",
                variant: 'destructive'
            })
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
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter verification code here</p>
                </div>


                <Form {...register}>
                    <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-6 text-black">
                        <FormField
                            name="verifyCode"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        className='text-gray-100'
                                    >
                                        Verification Code
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter verification code" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className='bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300'
                            type="submit"
                        >
                            Submit
                        </Button>
                    </form>
                </Form>

            </div>

        </div>
    )
}


