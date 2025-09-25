import { isValidObjectId} from "mongoose"
import { BoardServices } from "../services/BoardServices.js"
import { ListServices } from "../services/ListServices.js"
import { AppError } from "../utils/appError.js"
import { successResponse } from "../utils/response.js"
import {validatePartialSchema, validateSchema} from "../utils/validateSchema.js"
import { ListSchema } from "../validations/listSchema.js"


export class ListController{

    
    static async getAllLists(req, res){
        //const boardId = req.query

        let lists = []
        
        if (req.user.role === 'user'){
            //Get all boards of current user
            const boardsIds = await ListController.getUserBoardsIds(req.user.id)
            
            // Obtener listas de cada board y aplanarlas
            const listsArrays = await Promise.all(
                boardsIds.map(boardId => ListServices.getAllListsOfBoard(boardId))
            )
            
            lists = listsArrays.flat() 
        }else{
            //Get all lists
            lists = await ListServices.getAllLists()
        }
        
        return successResponse(res,lists)
        
    }            
    
        static async createList(req,res){
            //validate board id is valid
            const {boardId} = req.body
            if(!isValidObjectId(boardId)) throw new AppError('Invalid board id',400)

            //validate board exists
            if(!await BoardServices.getBoardById(boardId)) throw new AppError('Board not found',404)

            //Validate user role: User can only create lists in own boards
            if(req.user.role === 'user'){
                //Get all boards of current user
                const boardsIds = await ListController.getUserBoardsIds(req.user.id)
                //validates is user board 
                if(!boardsIds.includes(boardId)) throw new AppError('Forbidden',403)                
            }

            //Validate the request body
            const result = validateSchema(ListSchema, req.body)
            if(!result.success) {
                throw new AppError(JSON.parse(result.error).map(error => error.path + ': ' + error.message),400)
            } 

            //Create list
            const newList= await ListServices.createList(result.data)
            return successResponse(res, newList,201)        
            
        }

        static async getListById(req,res){
            
            //validate list id is valid
            const {id} = req.params
            if(!isValidObjectId(id)) throw new AppError('Invalid list id',400)

            //look for list
            const list = await ListServices.getListById(id)
            if(!list) throw new AppError('List not found',404)

            //Validate user role
            if(req.user.role === 'user'){
                //Get all boards of current user
                const boardsIds = await ListController.getUserBoardsIds(req.user.id)
                //validates is user board 
                if(!boardsIds.includes(list.boardId.toString())) throw new AppError('Forbidden',403)
            }

            return successResponse(res,list)
        }
        
        static async updateList(req,res){
            //validate list id is valid
            const {id} = req.params
            if(!isValidObjectId(id)) throw new AppError('Invalid list id',400)

            //look for list
            const list = await ListServices.getListById(id)
            if(!list) throw new AppError('List not found',404)

            //Validate user role: User can only update lists in own boards
            if(req.user.role === 'user'){
                //Get all boards of current user
                const boardsIds = await ListController.getUserBoardsIds(req.user.id)
                //validates it is user board 
                if(!boardsIds.includes(list.boardId.toString())) throw new AppError('Forbidden',403)                
            }

    
            //avoid user can update boardId
            const data = {
                ...req.body,
                boardId: list.boardId.toString()
            }
        
            //Validate the request body
            const result = validatePartialSchema(ListSchema, data)
            if(!result.success) {
                throw new AppError(JSON.parse(result.error).map(error => error.path + ': ' + error.message),400)
            } 

            //Update list
            const updatedList= await ListServices.updateList(id,result.data)
            return successResponse(res, updatedList)
            
        }
    
        static async deleteList(req,res){
            
            //validate list id is valid
            const {id} = req.params
            if(!isValidObjectId(id)) throw new AppError('Invalid list id',400)

            //look for list
            const list = await ListServices.getListById(id)
            if(!list) throw new AppError('List not found',404)

            //Validate user role: User can only delete lists in own boards
            if(req.user.role === 'user'){
                //Get all boards of current user
                const boardsIds = await ListController.getUserBoardsIds(req.user.id)
                //validates it is user board 
                if(!boardsIds.includes(list.boardId.toString())) throw new AppError('Forbidden',403)
            }

            //Delete list
            await ListServices.deleteList(id)
            return successResponse(res, {message: "List deleted successfully"})
        }
                        
        //Get all boards of current user
        static async getUserBoardsIds(userId) {
            const boards = await BoardServices.getAllUserBoards(userId)   
            return boards.map(board => board._id.toString())
        }
    }