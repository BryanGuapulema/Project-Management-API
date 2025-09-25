import { Router } from "express"
import { ListController } from "../controllers/ListController.js"

export const ListRouter = Router()

ListRouter.get('/', ListController.getAllLists)
ListRouter.post('/',ListController.createList)
ListRouter.get('/:id',ListController.getListById)
ListRouter.put('/:id',ListController.updateList)
ListRouter.delete('/:id',ListController.deleteList)