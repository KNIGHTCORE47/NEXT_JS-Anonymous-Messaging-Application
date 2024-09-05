import { z as zod } from 'zod'

export const verifySchema = zod
    .object({
        verifyCode: zod.string().min(6, { message: "Verification code must be atleast 6 characters long" }),
    })