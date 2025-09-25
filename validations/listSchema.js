import z from 'zod'

export const ListSchema = z.object({
    title: z.string().min(1),    
    boardId: z.string().length(24),
    position: z.number().int().optional()
})