import {ListController} from "../controllers/ListController.js"
import { TaskServices } from "../services/TaskServices.js"
import {ListServices} from"../services/ListServices.js"
import {UserServices} from "../services/UserServices.js"
import { TaskSchema } from "../validations/TaskSchema.js"
import {validatePartialSchema, validateSchema} from "../utils/validateSchema.js"
import {AppError} from "../utils/appError.js"
import { successResponse } from "../utils/response.js"
import { isValidObjectId } from "mongoose"

export class TaskController{
    static async createTask(req,res){        
        
        //data validation
        const result = validateSchema(TaskSchema,req.body)
        
        if (!result.success) {
            throw new AppError(
                result.error.errors.map(err => `${err.path.join(".")}: ${err.message}`).join(", "),
                400
            )
        }
        
        const {listId}= result.data
        let {assignedTo}= result.data
        
        //Validate listId exist
        const list = await ListServices.getListById(listId)
        if(! list) throw new AppError('List not found',404)
            
        //Validate assignedTo userId. if not provided use current userID
        if(assignedTo){
            if(! await UserServices.getUserById(assignedTo)) throw new AppError('User not found',404)
        }else{
            assignedTo= req.user.id
        }

        ////Validate user role: User can only create tasks in own lists
        if(req.user.role === 'user'){
            //Get all boards of current user
            const boardsIds = await ListController.getUserBoardsIds(req.user.id)
            //validates is user board 
            if(!boardsIds.includes(list.boardId.toString())) throw new AppError('Forbidden',403)                
        }

        //Create task
        const newTask = await TaskServices.createTask({...result.data,assignedTo})
        return successResponse(res, newTask, 201)


    }

    static async getAllTasks(req,res){
        let tasks = []
        if (req.user.role === 'user'){
            //Get all boards of current user
            const boardsIds = await ListController.getUserBoardsIds(req.user.id)
            
            // Get all board lists ids and flatten them
            const listsArrays = await Promise.all(
                boardsIds.map(boardId => ListServices.getAllListsOfBoard(boardId))
            )
            
            const listIds = listsArrays.flat().map(list => list._id)
            
            // Get all list tasks and flatten them
            const tasksArrays = await Promise.all(
                listIds.map(listId => TaskServices.getAllTasksofList(listId))
            )
            
            tasks = tasksArrays.flat()
        }else{            
            tasks = await TaskServices.getAllTasks()
        }

        return successResponse(res, tasks)

    }

    static async getTaskById(req,res){
        //validate task id is valid
        const {id} = req.params
        if(!isValidObjectId(id)) throw new AppError('Invalid task id',400)

        ////look for task
        const task = await TaskServices.getTaskById(id)
        if(!task) throw new AppError('Task not found',404)
        
        //Validate user role
        if(req.user.role === 'user'){
            //Get all boards of current user
            const boardsIds = await ListController.getUserBoardsIds(req.user.id)

            // Get all board lists ids and flatten them
            const listsArrays = await Promise.all(
                boardsIds.map(boardId => ListServices.getAllListsOfBoard(boardId))
            )            
            const listIds = listsArrays.flat().map(list => list._id.toString())            

            //validates is user board 
            if(!listIds.includes(task.listId.toString())) throw new AppError('Forbidden',403)
        }

        return successResponse(res,task)        
    }

    static async updateTask(req,res){

        //validate task id is valid
        const {id} = req.params
        if(!isValidObjectId(id)) throw new AppError('Invalid task id',400)

        ////look for task
        const task = await TaskServices.getTaskById(id)
        if(!task) throw new AppError('Task not found',404)

        //data validation
        const result = validatePartialSchema(TaskSchema,req.body)
        
        if (!result.success) {
            throw new AppError(
                result.error.errors.map(err => `${err.path.join(".")}: ${err.message}`).join(", "),
                400
            )
        }
        
        const list = await ListServices.getListById(task.listId)
        let {assignedTo}= result.data
            
        //Validate assignedTo userId if sent
        if(assignedTo){
            if(! await UserServices.getUserById(assignedTo)) throw new AppError('User not found',404)
        }else{
            assignedTo = task.assignedTo
        }

        ////Validate user role: User can only update tasks in own lists
        if(req.user.role === 'user'){
            //Get all boards of current user
            const boardsIds = await ListController.getUserBoardsIds(req.user.id)
            //validates if is user board 
            if(!boardsIds.includes(list.boardId.toString())) throw new AppError('Forbidden',403)                
        }

        //update task
        const updatedTask = await TaskServices.updateTask(id,{ ...result.data,assignedTo})
        return successResponse(res, updatedTask)                
    }
}