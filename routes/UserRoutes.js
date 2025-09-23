import { Router } from "express"
import {catchAsync} from "../utils/catchAsync.js"
import { UserController } from "../controllers/UserController.js"

export const userRouter = Router()

userRouter.get('/',catchAsync(UserController.getAllUsers))
userRouter.post('/',catchAsync(UserController.createUser))
userRouter.get('/:id',catchAsync(UserController.getUserById))
userRouter.put('/:id',catchAsync(UserController.updateUser))
userRouter.delete('/:id',catchAsync(UserController.deleteUser))