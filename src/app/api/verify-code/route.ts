import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import { z as zod } from 'zod'
import { verifySchema } from '@/schemas/verifySchema'
import { NextRequest, NextResponse } from 'next/server';


const userVerifyCodeSchema = zod.object({
    verifyCode: verifySchema.shape.verifyCode
})

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { username, code } = await request.json()

        //NOTE - Decode username acquired from URL using decodeURIcomponent
        const decodedUsername = decodeURIComponent(username)

        //NOTE - Find user by username using database query
        const user = await UserModel.findOne({ username: decodedUsername })

        //NOTE - If user is not found return error
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found"
                },
                { status: 404 }
            )
        }

        //NOTE - Check if verification code has valid format
        const pasrseCode = userVerifyCodeSchema.safeParse({ verifyCode: code })

        if (!pasrseCode.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid verification code format"
                },
                { status: 400 }
            )

        }

        //NOTE - Check if verification code is valid and has not expired yet
        const isCodeValid = user.verifyCode === pasrseCode.data.verifyCode
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {

            //NOTE - Set user as verified
            user.isVerified = true

            //NOTE - Save user to database as verified
            await user.save()

            return NextResponse.json(
                {
                    success: true,
                    message: "Account verified successfully"
                },
                { status: 200 }
            )
        } else if (isCodeValid && !isCodeNotExpired) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Verification code has expired"
                },
                { status: 400 }
            )
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid verification code"
                },
                { status: 400 }
            )
        }

    } catch (error) {
        console.log("Error verifying user", error);
        return NextResponse.json(
            {
                success: false,
                error: "Error verifying user"
            },
            { status: 500 }
        )
    }
}