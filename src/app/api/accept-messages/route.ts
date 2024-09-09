import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import { User } from "next-auth"
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions)

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

    const userId = user._id

    //NOTE - Frontend flag as true or false to accept messages
    const { acceptMessages } = await request.json()

    try {
        const updatedUserAcceptOrRejectMessges = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )

        if (!updatedUserAcceptOrRejectMessges) return NextResponse.json(
            {
                success: false,
                error: "Error accepting messages"
            },
            { status: 401 }
        )

        return NextResponse.json(
            {
                success: true,
                message: "User status updated successfully ready to accept messages",
                updatedUserAcceptOrRejectMessges
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("Failed to update user status. Error accepting messages", error);
        return NextResponse.json(
            {
                success: false,
                error: "Error accepting messages"
            },
            { status: 500 }
        )
    }

}


export async function GET(request: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions)

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

    const userId = user._id

    try {
        const verifiedUserWithId = await UserModel.findById(userId)

        if (!verifiedUserWithId) return NextResponse.json(
            {
                success: false,
                error: "User not found"
            },
            { status: 404 }
        )

        return NextResponse.json(
            {
                success: true,
                isAcceptingMessages: verifiedUserWithId.isAcceptingMessages,
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed to get user status. Error getting user status", error)
        return NextResponse.json(
            {
                success: false,
                error: "Error getting user status",
            },
            { status: 500 }
        )
    }
}