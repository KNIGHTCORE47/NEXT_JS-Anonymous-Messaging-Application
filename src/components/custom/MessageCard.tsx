"use client"

import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { Message } from '@/models/user.models'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { ApiResponse } from '@/types/apiResponse'


type messageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}



export default function MessageCard({ message, onMessageDelete }: messageCardProps) {

    const { toast } = useToast();

    async function handleDeleteConfirm() {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)

        toast({
            title: response.data.message,
        })

        onMessageDelete(String(message._id))
    }

    return (
        <div>

            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>

                    <div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                                    <AlertDialogAction
                                        onClick={handleDeleteConfirm}
                                    >
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
            </Card>




        </div>
    )
}
