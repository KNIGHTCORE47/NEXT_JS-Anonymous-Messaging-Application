import { sendVerifictionEmail } from '@/helpers/sendVerifictionEmail';
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/user.models';
import bcryptjs from 'bcryptjs'
import { NextResponse, NextRequest } from 'next/server';


export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();



        //NOTE - check if username, email and password are not empty
        if (!username || !email || !password) return NextResponse.json({ error: "Invalid useername, email or password" }, { status: 400 })



        //NOTE - get user by its username
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        })


        //NOTE - check if username already exists
        if (existingUserVerifiedByUsername) return NextResponse.json(
            {
                success: false,
                error: "Username already exists"
            }, { status: 400 }
        )



        //NOTE - get user by its email
        const existingUserByEmail = await UserModel.findOne({ email });

        const generateRandomOTP = Math.floor(100000 + Math.random() * 900000).toString();

        //NOTE - check if email already exists
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) return NextResponse.json(
                {
                    success: false,
                    error: "User already exists with this email",
                },
                { status: 400 }
            )
            else {
                const hashedPassword = await bcryptjs.hash(password, 10);
                const expiryDate = new Date()
                expiryDate.setHours(expiryDate.getHours() + 1)



                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = generateRandomOTP
                existingUserByEmail.verifyCodeExpiry = expiryDate

                await existingUserByEmail.save();
            }

        }
        else {

            //NOTE - create new user cause email doesn't exist
            const hashedPassword = await bcryptjs.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: generateRandomOTP,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            })

            await newUser.save();
        }



        //NOTE - send verification email
        const emailResponse = await sendVerifictionEmail(username, email, generateRandomOTP)

        //NOTE - return response based on email response 
        if (!emailResponse.success) return NextResponse.json(
            {
                success: false,
                error: emailResponse.message || "Error sending verification email",
            },
            { status: 500 }
        )

        //NOTE - return response based on email response
        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully, Please check your email for verification code" || emailResponse.message,
            },
            { status: 201 }
        )

    } catch (error) {

        console.error("Error registering user", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error parsing request body"
            },
            { status: 500 }
        );
    }
}