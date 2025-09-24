import { BoardServices } from "../services/BoardServices.js"
import { AppError } from "../utils/appError.js"
import { successResponse } from "../utils/response.js"
import { validatePartialSchema, validateSchema } from '../utils/validateSchema.js'
import { boardSchema } from "../validations/boardSchema.js"


export class BoardController{
    //Get all boards of a user
    static async getAllBoards(req,res){
        const boards= await BoardServices.getAllBoards(req.user.id)
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