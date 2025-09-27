import { Router } from "express"
import {catchAsync} from "../utils/catchAsync.js"
import { TaskController } from "../controllers/TaskController.js"

export const TaskRouter = Router()

TaskRouter.post('/',catchAsync(TaskController.createTask))
TaskRouter.get('/', catchAsync(TaskController.getAllTasks))
TaskRouter.get('/:id',catchAsync(TaskController.getTaskById))
TaskRouter.put('/:id',catchAsync(TaskController.updateTask))
TaskRouter.delete('/:id',catchAsync(TaskController.deleteTask))