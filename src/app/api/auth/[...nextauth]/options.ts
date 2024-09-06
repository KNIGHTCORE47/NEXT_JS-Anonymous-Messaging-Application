import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs'
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/user.models';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@ex.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();

                try {

                    //NOTE - check if user with username or email credentials exists
                    const signInUser = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier.email },
                            { username: credentials.identifier.username }
                        ]
                    })

                    //NOTE - check if user is not exists
                    if (!signInUser) {
                        throw new Error("No user found with this email or username");
                    }

                    //NOTE - check if user is verified
                    if (!signInUser.isVerified) {
                        throw new Error("Please verify your account first");
                    }

                    //NOTE - check if password is valid by comparing hashed password with user given password
                    const isPasswordValid = await bcryptjs.compare(credentials.password, signInUser.password);

                    //NOTE - check if password is not valid
                    if (!isPasswordValid) {
                        throw new Error("Incorrect password");
                    }

                    return {
                        user: signInUser
                    };


                } catch (error: any) {
                    throw new Error("Invalid email address", error);
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.username = token.username
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
            }
            return token
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt",
    },
    secret: String(process.env.NEXTAUTH_SECRET_KEY),
}