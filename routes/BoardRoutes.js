import { Router } from 'express'
import { catchAsync } from '../utils/catchAsync.js'
import { BoardController } from '../controllers/BoardController.js'

export const BoardRouter = Router()

BoardRouter.get('/', catchAsync(BoardController.getAllBoards))
BoardRouter.post('/', catchAsync(BoardController.createBoard))
BoardRouter.get('/:id', catchAsync(BoardController.getBoardById))
BoardRouter.get('/:id/lists', catchAsync(BoardController.getListsByBoardId))
BoardRouter.put('/:id', catchAsync(BoardController.updateBoard))
BoardRouter.delete('/:id', catchAsync(BoardController.deleteBoard))
