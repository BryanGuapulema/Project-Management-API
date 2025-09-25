import { List } from "../models/ListModel.js"

export class ListServices {
    static async getAllLists(){
        return await List.find()        
    }

    static async getAllListsOfBoard(boardId){
        return await List.find({boardId}).sort({ createdAt: -1 })
    }        

    static async createList(data){
        return await List.create(data)
    }

    static async getListById(id){
        return await List.findById(id)
    }

    static async updateList(id,data){
        return await List.findByIdAndUpdate(id,data,{new: true})
    }

    static async deleteList(id){
        return await List.findByIdAndDelete(id)
    }
}