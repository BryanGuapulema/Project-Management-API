import { Router } from "express"
import {catchAsync} from "../utils/catchAsync.js"
import { ListController } from "../controllers/ListController.js"

export const ListRouter = Router()

ListRouter.get('/', catchAsync(ListController.getAllLists))
ListRouter.post('/',catchAsync(ListController.createList))
ListRouter.get('/:id',catchAsync(ListController.getListById))
ListRouter.put('/:id',catchAsync(ListController.updateList))
ListRouter.delete('/:id',catchAsync(ListController.deleteList))