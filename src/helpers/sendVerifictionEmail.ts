import { resend } from '@/lib/resend'
import verificationEmail from '../../emails/verificationEmail'

//NOTE - Standarized the api response
import { ApiResponse } from '@/types/apiResponse'


export async function sendVerifictionEmail(
    username: string,
    email: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anonymous Message App - Verification Code',
            react: verificationEmail({ username, otp: verifyCode }),
        });

        return { success: true, message: "Verification email sent successfully" }
    }
    catch (emailError) {
        console.log("Error sending verification email", emailError);
        return { success: false, message: "Error sending verification email" }
    }
}