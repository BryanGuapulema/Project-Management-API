import { Router } from "express"
import { BoardController } from "../controllers/BoardController.js"

export const BoardRouter = Router()

BoardRouter.get('/',BoardController.getAllBoards)
