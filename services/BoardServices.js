import { Board } from "../models/BoardModel.js";

export class BoardServices {
    //Get all boards of a user
    static async getAllBoards(ownerId){
        return await Board.find({ownerId}).sort({ createdAt: -1 })
    }

    //create a board by logged user
    static async createBoard(data){        
        return await Board.create(data)
    }
}