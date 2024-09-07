import { z as zod } from 'zod'
import { usernameValidation } from './usernameValidation'

export const signUpSchema = zod
    .object({
        username: usernameValidation,
        email: zod.string().email({ message: "Invalid email address" }),
        password: zod.string().min(6, { message: "Password must be atleast 6 characters long" }),
    })