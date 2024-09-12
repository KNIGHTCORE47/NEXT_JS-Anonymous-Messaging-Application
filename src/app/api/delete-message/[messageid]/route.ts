import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { messageid: string } }) {
    await dbConnect();

    //NOTE - Find message id from params
    const messageId = params.messageid

    //NOTE - Find user with userId from Session
    const session = await getServerSession(authOptions)

    //NOTE - Check user derived from session.user
    const user: User = session?.user

    //NOTE - check if user is authenticated
    if (!session || !session?.user) {
        return NextResponse.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        )
    }

    try {

        const deletedMessage = await UserModel.updateOne(
            { _id: user._id },
            {
                $pull: {
                    messages: {
                        _id: messageId
                    }
                }
            }
        )

        if (deletedMessage.modifiedCount === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Message not found or already deleted"
                },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Message deleted successfully"
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("Error deleting message", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error deleting message"
            },
            { status: 500 }
        )
    }
}