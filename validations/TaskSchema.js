import z from 'zod'
import { isValidObjectId } from 'mongoose'

const objectIdSchema = z.string().refine((val) => isValidObjectId(val), {
  message: "Invalid ObjectId format"
})

export const TaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),    
    status: z.enum(["todo", "in-progress", "done"]).default("todo"),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
    dueDate: z.coerce.date().optional(),
    assignedTo: objectIdSchema.optional(),
    listId: objectIdSchema
})