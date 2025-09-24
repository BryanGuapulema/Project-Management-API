import { Router } from "express"
import {catchAsync} from "../utils/catchAsync.js"
import { AuthController } from "../controllers/AuthController.js"

export const authRouter = Router()

authRouter.post('/register',catchAsync(AuthController.register))
authRouter.post('/login',catchAsync(AuthController.login))
authRouter.post('/logout',catchAsync(AuthController.logout))
authRouter.post('/refresh',catchAsync(AuthController.refresh))
