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
}