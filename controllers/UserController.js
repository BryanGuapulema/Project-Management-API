import { UserServices } from '../services/UserServices.js'
import { BoardServices } from '../services/BoardServices.js'
import {AppError} from '../utils/appError.js'
import { validatePartialSchema, validateSchema } from '../utils/validateSchema.js'
import { userSchema } from '../validations/userSchema.js'
import { successResponse } from '../utils/response.js'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../config/config.js'
import { isValidObjectId } from 'mongoose'
import { ListServices } from '../services/ListServices.js'
import { ListController } from './ListController.js'
import { TaskServices } from '../services/TaskServices.js'

export class UserController{
    static async getAllUsers(req,res){

        if(req.user.role !== 'admin') throw new AppError('Forbidden',403)
        
        const users  = await UserServices.getAllUsers()
        successResponse(res,users)
    }

    static async getUserById(req,res){

        //validate user id
        const {id} = req.params
        if(!isValidObjectId(id)) throw new AppError('Invalid user id',400)
            
        //check for role. If user check for id authorized
        if(req.user.role !== 'admin' && req.user.id !== id) throw new AppError('Forbidden',403)                            
        
        //validate user exists
        const user = await UserServices.getUserById(id)
        if (!user) throw new AppError('User not found', 404)

        //return user
        return successResponse(res,user)
    }

    static async createUser(req,res){

        //validate req.body
        const result = validateSchema(userSchema, req.body)
        if(!result.success) {
            throw new AppError(JSON.parse(result.error).map(error => error.path + ': ' + error.message),400)
        }

        //hash password
        const {password} = result.data
        const passwordHashed = await bcrypt.hash(password,SALT_ROUNDS)

        //create new user
        const newUser = await UserServices.createUser({...result.data, password: passwordHashed})
        successResponse(res,newUser,201)
    }
    
    static async updateUser(req,res){
        //validate user id
        const {id} = req.params
        if(!isValidObjectId(id)) throw new AppError('Invalid user id',400)
        
        //check for role. If user check for id authorized
        if(req.user.role !== 'admin' && req.user.id !== id) throw new AppError('Forbidden',403)     
            
        //validate req body
        const result = validatePartialSchema(userSchema, req.body)
        if(!result.success) {
            throw new AppError(JSON.parse(result.error).map(error => error.path + ': ' + error.message),400)
        }
        
        //update user
        const userUpdated = await UserServices.updateUser(id, result.data)
        if (!userUpdated) throw new AppError('User not found', 404)       
        successResponse(res,userUpdated) 
    }
    static async deleteUser(req,res ){
        //validate user id
        const {id} = req.params
        if(!isValidObjectId(id)) throw new AppError('Invalid user id',400)        
        
        //check for role. If user check for id authorized
        if(req.user.role !== 'admin' && req.user.id !== id) throw new AppError('Forbidden',403) 
        
        //delete user
        const userDeleted = await UserServices.deleteUser(id)
        if (!userDeleted) throw new AppError('User not found', 404)
        successResponse(res,userDeleted)
    }

    static async getUserBoards(req,res){
        //validate user id
        const {id} = req.params
        if(!isValidObjectId(id)) throw new AppError('Invalid user id',400)
            
        //check for role. If user check for id authorized
        if(req.user.role !== 'admin' && req.user.id !== id) throw new AppError('Forbidden',403)                            
        
        //validate user exists
        const user = await UserServices.getUserById(id)
        if (!user) throw new AppError('User not found', 404)

        //Validate user role: User can only access own boards        
        const boards = await BoardServices.getAllUserBoards(id)
        return successResponse(res,boards)
    }

    static async getUserLists(req,res){
        //validate user id
        const {id} = req.params
        if(!isValidObjectId(id)) throw new AppError('Invalid user id',400)
            
        //check for role. If user check for id authorized
        if(req.user.role !== 'admin' && req.user.id !== id) throw new AppError('Forbidden',403)                            
        
        //validate user exists
        const user = await UserServices.getUserById(id)
        if (!user) throw new AppError('User not found', 404)

        //Get all boards of current user
        const boardsIds = await ListController.getUserBoardsIds(id)
        
        // Get all board lists and flatten them
        const listsArrays = await Promise.all(
            boardsIds.map(boardId => ListServices.getAllListsOfBoard(boardId))
        )
        
        const lists = listsArrays.flat()

        return successResponse(res,lists)
    }

    static async getUserTasks(req,res){
        //validate user id
        const {id} = req.params
        if(!isValidObjectId(id)) throw new AppError('Invalid user id',400)
            
        //check for role. If user check for id authorized
        if(req.user.role !== 'admin' && req.user.id !== id) throw new AppError('Forbidden',403)                            
        
        //validate user exists
        const user = await UserServices.getUserById(id)
        if (!user) throw new AppError('User not found', 404)

        //Get all boards of current user
        const boardsIds = await ListController.getUserBoardsIds(id)
        
        // Get all board lists ids and flatten them
        const listsArrays = await Promise.all(
            boardsIds.map(boardId => ListServices.getAllListsOfBoard(boardId))
        )
        
        const listIds = listsArrays.flat().map(list => list._id)
        
        // Get all list tasks and flatten them
        const tasksArrays = await Promise.all(
            listIds.map(listId => TaskServices.getAllTasksofList(listId))
        )
        
        const tasks = tasksArrays.flat()
        return successResponse(res,tasks)
    }



}