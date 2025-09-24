import { Router } from "express"
import { BoardController } from "../controllers/BoardController.js"

export const BoardRouter = Router()

BoardRouter.get('/',BoardController.getAllBoards)
BoardRouter.post('/',BoardController.createBoard)
BoardRouter.get('/:id',BoardController.getBoardById)
BoardRouter.put('/:id',BoardController.updateBoard)