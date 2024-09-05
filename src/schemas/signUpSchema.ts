import { z as zod } from 'zod'

export const usernameValidation = zod
    .string()
    .min(2, "Username must be atleast 2 characters long")
    .max(20, "Username must be atmost 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric and not contain special characters")

export const signUpSchema = zod
    .object({
        username: usernameValidation,
        email: zod.string().email({ message: "Invalid email address" }),
        password: zod.string().min(6, { message: "Password must be atleast 6 characters long" }),
    })