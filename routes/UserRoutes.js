import { Router } from "express"
import {catchAsync} from "../utils/catchAsync.js"
import { UserController } from "../controllers/UserController.js"

export const userRouter = Router()

userRouter.get('/',catchAsync(UserController.getAllUsers))
userRouter.get('/:id',catchAsync(UserController.getUserById))