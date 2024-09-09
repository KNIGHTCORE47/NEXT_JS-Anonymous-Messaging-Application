import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import { User } from "next-auth"
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
    await dbConnect();

    //NOTE - Find user with userId from Session
    const session = await getServerSession(authOptions)

    //NOTE - Check user derived from session.user
    const user: User = session?.user

    //NOTE - check if user is authenticated
    if (!session || !session?.user) {
        return NextResponse.json(
            {
                success: false,
                error: "Not authenticated"
            },
            { status: 401 }
        )
    }

    //NOTE - Get userId from user and parse it through mongoose objectId to avoid common string error casuse it will be used in mongDB aggrigation pipeline
    const userId = new mongoose.Types.ObjectId(user._id);

    try {

        //NOTE - Get All User Messages Using MongoDB Aggrigation Pipeline
        const userWithAllMessages = await UserModel.aggregate(
            [
                {
                    $match: {
                        _id: userId
                    },
                },
                { $unwind: "$messages" },
                {
                    $sort: {
                        "messages.createdAt": -1
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        messages: {
                            $push: "$messages"
                        }
                    }
                }
            ]
        )

        console.log("User with all messages ", userWithAllMessages);

        if (!userWithAllMessages || userWithAllMessages.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found"
                },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                messages: userWithAllMessages[0].messages
            },
            { status: 200 }
        )


    } catch (error) {
        console.log("An unexpected error occured", error);
        return NextResponse.json(
            {
                success: false,
                error: "An unexpected error occured"
            },
            { status: 500 }
        )

    }
}
