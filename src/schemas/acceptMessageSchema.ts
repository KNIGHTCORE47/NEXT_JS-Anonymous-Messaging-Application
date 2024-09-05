import { z as zod } from 'zod'


export const acceptMessageSchema = zod
    .object({
        acceptMessage: zod.boolean().default(false)
    })