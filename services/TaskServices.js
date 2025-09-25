import { Task } from "../models/TaskModel.js"

export class TaskServices{
    static async createTask(data){
        return await Task.create(data)
    }

    static async getAllTasks(){
        return await Task.find()
    }

    static async getAllTasksofList(listId){
        return await Task.find({listId})
    }
}