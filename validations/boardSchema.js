import z from 'zod'

export const boardSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    status: z.enum(['active', 'completed', 'hold']).optional(),
    //ownerId: z.string().length(24)
})