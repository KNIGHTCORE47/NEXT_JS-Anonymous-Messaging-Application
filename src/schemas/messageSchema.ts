import { z as zod } from 'zod'

export const contentValidation = zod
    .string()
    .min(10, { message: "Content must be atleast 10 characters long" })
    .max(255, { message: "Content must be atmost 255 characters long" })

export const messageSchema = zod
    .object({
        content: contentValidation
    })