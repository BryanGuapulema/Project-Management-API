import { Task } from "../models/TaskModel.js"

export class TaskServices{
    static async createTask(data){
        return await Task.create(data)
    }

    static async getAllTasks(){
        return await Task.find().sort({dueDate: -1})
    }

    static async getAllTasksofList(listId){
        return await Task.find({listId}).sort({dueDate: -1})
    }

    static async getTaskById(id){
        return await Task.findById(id)
    }

    static async updateTask(id, data){
        return await Task.findByIdAndUpdate(id,data,{new: true})
    }

    static async deleteTask(id){
        return await Task.findByIdAndDelete(id)
    }
}