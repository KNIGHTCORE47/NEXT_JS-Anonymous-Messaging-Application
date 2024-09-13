"use client"

import MessageCard from '@/components/custom/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Message, User } from '@/models/user.models'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function userDashboard() {

    const [messages, setMessages] = useState<Message[]>([])

    //NOTE - Check state during fetching of messages
    const [isLoading, setIsLoading] = useState(false)

    //NOTE - Check state during switching of the button on/off
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const { toast } = useToast()

    //NOTE - Optimistic Ui Approach: Imidiate Ui response for client which will be handle by backend in future,creates an illusiion at the frontend of work has been done, cause backed has a tendency toward multiple failures.
    function handleDeleteMessages(messageId: string) {
        setMessages(messages.filter(message => message._id !== messageId))
    }

    //NOTE - Get session data to determine if user is authenticated
    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    })

    console.log("Form data:", form);

    const { register, watch, setValue } = form

    //NOTE - Inject watch method
    const watchAcceptMessages = watch("acceptMessage")

    //NOTE - Here we call the fetchAcceptMessages function when the user is ready to accept messages
    const fetchAcceptMessages = useCallback(
        async () => {

            //NOTE - set state of the loader to true
            setIsSwitchLoading(true)

            try {

                //NOTE - Initiate axios response to determine current state of user.isAcceptingMessages
                const response = await axios.get<ApiResponse>("/api/accept-messages")

                //NOTE - here we feed setValue method with the current value of user.isAcceptingMessages boolean value
                setValue("acceptMessage", response.data.isAcceptingMessages)

                toast({
                    title: response.data.success?.toString() || "Successfully fetched accept messages settings",
                    description: response?.data.message || "User is ready to accept messages",
                })

            } catch (error) {
                console.error("Error fetching accept messages", error);
                const axiosError = error as AxiosError<ApiResponse>

                toast({
                    title: axiosError.response?.data.success?.toString() || "Error fetching accept messages settings",
                    description: axiosError.response?.data.message || "Error fetching accept messages settings",
                    variant: 'destructive'
                })
            } finally {
                //NOTE - set state of the loader to false
                setIsSwitchLoading(true)
            }

        }, [setValue])

    //NOTE - Now we have to get all the collection of messages from user
    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {

            setIsLoading(true)
            setIsSwitchLoading(false)

            try {

                const response = await axios.get<ApiResponse>("/api/get-messages")

                //NOTE - set all the messages inside the state handled by setMessages
                setMessages(response.data.messages || [])

                if (refresh === true) {

                    toast({
                        title: response.data.success?.toString() || "Refreshed messages",
                        description: response.data.message || "Showing latest messages",
                        variant: 'destructive'
                    })
                }

            } catch (error) {
                console.error("Error fetching all the messages", error);
                const axiosError = error as AxiosError<ApiResponse>

                toast({
                    title: axiosError.response?.data.success?.toString() || "Error",
                    description: axiosError.response?.data.message || "Error fetching all the messages",
                    variant: 'destructive'
                })
            } finally {
                setIsLoading(false)
                setIsSwitchLoading(false)
            }

        }, [setIsLoading, setMessages, toast])

    useEffect(() => {
        if (!session || !session?.user) return

        //NOTE - Here we call the fetchAcceptMessages function when the user is ready to accept messages
        fetchAcceptMessages();

        //NOTE - Here we call the fetchMessages function to get all the messages
        fetchMessages();

    }, [session, setValue, fetchAcceptMessages, fetchMessages])

    //NOTE - Here we handle switching of the button on/off with handleSwitchChange function/method
    async function handleSwitchChange() {
        try {
            const response = await axios.post<ApiResponse>("/api/accept-messages", {
                acceptMessage: !watchAcceptMessages
            })

            setValue("acceptMessage", !watchAcceptMessages)

            toast({
                title: response?.data.message || "Successfully switched button",
                variant: 'default'
            })

        } catch (error) {
            console.error("Error switching button", error);
            const axiosError = error as AxiosError<ApiResponse>

            toast({
                title: axiosError.response?.data.success?.toString() || "Error",
                description: axiosError.response?.data.message || "Error switching button",
                variant: 'destructive'
            })
        }
    }

    const { username } = session?.user as User

    const baseUrl = `${window.location.protocol}//${window.location.host}`

    const profileUrl = `${baseUrl}/u/${username}`

    function copyToClipboard() {
        navigator.clipboard.writeText(profileUrl)

        toast({
            title: "Copied to clipboard",
            description: "Link copied to clipboard",
            variant: 'default'
        })
    }



    if (!session || !session?.user) {
        return (
            <div>
                Please Login <Link
                    className="text-blue-500 hover:text-blue-700 underline"
                    href="/sign-in"
                >
                    Click Here!!
                </Link>
            </div>
        )

    }


    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessages')}
                    checked={watchAcceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {watchAcceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={String(message._id) || index}
                            message={message}
                            onMessageDelete={handleDeleteMessages}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    )
}

