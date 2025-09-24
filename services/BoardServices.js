import { Board } from "../models/BoardModel.js";

export class BoardServices {
    //Get all boards of a user
    static async getAllBoards(ownerId){
        return await Board.find({ownerId})
    }
}