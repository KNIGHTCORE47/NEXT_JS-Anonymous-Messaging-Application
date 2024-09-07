import { z as zod } from 'zod'

export const usernameValidation = zod
    .string()
    .min(2, "Username must be atleast 2 characters long")
    .max(20, "Username must be atmost 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric and not contain special characters")