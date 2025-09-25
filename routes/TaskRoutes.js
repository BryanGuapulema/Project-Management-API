import { Router } from "express"
import { TaskController } from "../controllers/TaskController.js"

export const TaskRouter = Router()

TaskRouter.post('/',TaskController.createTask)
TaskRouter.get('/', TaskController.getAllTasks)
TaskRouter.get('/:id',TaskController.getTaskById)
TaskRouter.put('/:id',TaskController.updateTask)
// TaskRouter.delete('/:id',TaskController.deleteList)