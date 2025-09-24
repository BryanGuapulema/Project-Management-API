import { Board } from "../models/BoardModel.js";

export class BoardServices {
    //Get all boards of a user
    static async getAllUserBoards(ownerId){
        return await Board.find({ownerId}).sort({ createdAt: -1 })
    }
    
    //get all Boards
    static async getAllBoards(){
        return await Board.find().sort({ createdAt: -1 })
    }

    //create a board by logged user
    static async createBoard(data){        
        return await Board.create(data)
    }

    //get board by id
    static async getBoardById(id){
        return await Board.findById(id)
    }
}