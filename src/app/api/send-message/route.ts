import { dbConnect } from "@/lib/dbConnect";
import { Message } from '@/models/user.models'
import UserModel from '@/models/user.models'
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect();
    try {

        //NOTE - send message as content by authenticated user
        const values = await request.json();
        const { username, content } = values;

        //NOTE - check if user exists in database
        const user = await UserModel.findOne({ username });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found"
                },
                { status: 404 }
            )
        }

        //NOTE - is user accepting the messages
        if (!user.isAcceptingMessages) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User is not accepting the messages"
                },
                { status: 403 }
            )
        }

        //NOTE - create new message with current date
        const newMessage = {
            content,
            createdAt: new Date()
        }

        //NOTE - push new message to user messages
        user.messages.push(newMessage as Message);

        //NOTE - save user with new message value
        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "User message sent successfully"
            },
            { status: 200 }
        )


    } catch (error) {
        console.log("Error sending message", error);
        return NextResponse.json(
            {
                success: false,
                error: "Internal server error"
            },
            { status: 500 }
        )

    }

}
