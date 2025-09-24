import { BoardServices } from "../services/BoardServices.js"
import { successResponse } from "../utils/response.js"

export class BoardController{
    //Get all boards of a user
    static async getAllBoards(req,res){
        const boards= await BoardServices.getAllBoards(req.user.id)
        return successResponse(res, boards)
    } 
}