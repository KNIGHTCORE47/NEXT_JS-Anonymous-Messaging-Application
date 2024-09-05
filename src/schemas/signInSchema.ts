import { z as zod } from 'zod'

export const signInSchema = zod
    .object({
        identifier: zod.string(),
        password: zod.string()
    })