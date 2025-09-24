import { isValidObjectId} from "mongoose"
import { BoardServices } from "../services/BoardServices.js"
import { AppError } from "../utils/appError.js"
import { successResponse } from "../utils/response.js"
import { validatePartialSchema, validateSchema } from '../utils/validateSchema.js'
import { boardSchema } from "../validations/boardSchema.js"


export class BoardController{
    static async getAllBoards(req,res){
        const {status} = req.query        
        let boards = null

        if (req.user.role === 'user'){
            //Get all boards of current user
            boards= await BoardServices.getAllUserBoards(req.user.id)             
        }else{
            //Get all boards
            boards= await BoardServices.getAllBoards()
        }
        
        //filter by status
        if (status){
            const result = validatePartialSchema(boardSchema,{status})
            if(!result.success) throw new AppError('status not valid',400)
            boards = boards.filter(board => board.status === status)
        }

        return successResponse(res, boards)
    } 

    //create a board by logged user
    static async createBoard(req,res){
        const result = validateSchema(boardSchema,req.body)
        
        if(!result.success) {
            throw new AppError(JSON.parse(result.error).map(error => error.path + ': ' + error.message),400)
        }        
        
        const data = {
            ...result.data,
            ownerId: req.user.id
        }
        const newBoard= await BoardServices.createBoard(data)
        return successResponse(res, newBoard,201)
    } 

    //get board by id
    static async getBoardById(req,res){
        const {id} = req.params                
        if(!isValidObjectId(id)) throw new AppError('Invalid board id format',400)
            
        const board = await BoardServices.getBoardById(id)
        if (!board) throw new AppError('Board not found', 404)

        if(req.user.role === 'user'){
            if(board.ownerId.toString() !== req.user.id) {
                throw new AppError('You are not the owner of this board',403)
            }
        }


        return successResponse(res,board)
    }

    //update board
    static async updateBoard(req,res){
        const {id} = req.params                
        if(!isValidObjectId(id)) throw new AppError('Invalid board id format',400)

        const result = validatePartialSchema(boardSchema,req.body)
        
        if(!result.success) {
            throw new AppError(JSON.parse(result.error).map(error => error.path + ': ' + error.message),400)
        }    
        
        const board = await BoardServices.getBoardById(id)
        if (!board) throw new AppError('Board not found', 404)


        if(req.user.role !== 'admin' && board.ownerId.toString() !== req.user.id ){            
            throw new AppError('You are not the owner of this board',403)            
        }
                
        const boardUpdated= await BoardServices.updateBoard(id,result.data)

        return successResponse(res, boardUpdated)
        
    }
}