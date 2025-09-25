import {ListController} from "../controllers/ListController.js"
import { TaskServices } from "../services/TaskServices.js"
import {ListServices} from"../services/ListServices.js"
import {UserServices} from "../services/UserServices.js"
import { TaskSchema } from "../validations/TaskSchema.js"
import {validateSchema} from "../utils/validateSchema.js"
import {AppError} from "../utils/appError.js"
import { successResponse } from "../utils/response.js"

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
}