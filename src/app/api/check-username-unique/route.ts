import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import { z as zod } from 'zod'
import { usernameValidation } from '@/schemas/usernameValidation'
import { NextRequest, NextResponse } from 'next/server';



//NOTE - Creation of Query Schema
const usernameQuerySchema = zod.object({
    username: usernameValidation
})


export async function GET(request: NextRequest) {

    // //NOTE - HTTP Request Safety Checks [OLD CODE]
    // if (request.method !== "GET") {
    //     return NextResponse.json(
    //         {
    //             success: false,
    //             error: "Invalid request method"
    //         },
    //         { status: 405 }
    //     )
    // }

    await dbConnect();

    try {
        //NOTE - Find user by username using Query Prameters
        const { searchParams } = new URL(request.url)
        const queryParams = {
            username: searchParams.get("username")
        }

        //NOTE - Validation of Query Parameters with Zod
        const result = usernameQuerySchema.safeParse(queryParams)

        console.log(result);

        //NOTE - Get username errors from result
        if (!result.success) {

            //NOTE - Here usernameErrors will be an array
            const usernameErrors = result.error.format().username?._errors || []

            return NextResponse.json(
                {
                    success: false,
                    error: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters"
                }, { status: 400 }
            )
        }

        //NOTE - Find user by username
        const { username } = result.data;

        //NOTE - Database Query to check if username is already taken and user is verified
        const existingVerifiedUser = await UserModel.findOne(
            {
                username,
                isVerified: true
            }
        );

        //NOTE - Check if username is already taken based on its verification
        if (existingVerifiedUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Username is already taken"
                },
                { status: 400 }
            )
        } else if (!existingVerifiedUser) {
            return NextResponse.json(
                {
                    success: true,
                    message: "Username is available"
                },
                { status: 200 }
            )
        }

    } catch (error) {
        console.log("Error checking username", error);
        return NextResponse.json(
            {
                success: false,
                error: "Error checking if username is unique"
            },
            { status: 500 }
        )
    }
}