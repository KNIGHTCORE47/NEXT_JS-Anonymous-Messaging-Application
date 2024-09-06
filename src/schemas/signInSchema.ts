import { z as zod } from 'zod'

export const signInSchema = zod
    .object({
        identifier: zod.string(),   //NOTE - identifier is the email
        password: zod.string()
    })