import { UserServices } from '../services/UserServices.js'
import {AppError} from '../utils/appError.js'
import { validatePartialSchema, validateSchema } from '../utils/validateSchema.js'
import { userSchema } from '../validations/userSchema.js'
import { successResponse } from '../utils/response.js'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../config/config.js'
import { isValidObjectId } from 'mongoose'

export class UserController{
    static async getAllUsers(req,res){
        if(req.user.role !== 'admin') throw new AppError('Forbidden',403)
        const users  = await UserServices.getAllUsers()
        successResponse(res,users)
    }

    static async getUserById(req,res){
        const {id} = req.params

        if(!isValidObjectId(id)) throw new AppError('Invalid user id',400)
        const user = await UserServices.getUserById(id)
        if (!user) throw new AppError('User not found', 404)
        
        if(req.user.role !== 'admin' && req.user.id !== id) throw new AppError('Forbidden',403)                            

        return successResponse(res,user)
    }

    static async createUser(req,res){
        const result = validateSchema(userSchema, req.body)
        if(!result.success) {
            throw new AppError(JSON.parse(result.error).map(error => error.path + ': ' + error.message),400)
        }

        const {password} = result.data
        const passwordHashed = await bcrypt.hash(password,SALT_ROUNDS)

        const newUser = await UserServices.createUser({...result.data, password: passwordHashed})
        successResponse(res,newUser,201)
    }
    
    static async updateUser(req,res){
        //validate user id
        const {id} = req.params
        if(!isValidObjectId(id)) throw new AppError('Invalid user id',400)

        //validate user exists
        const user = await UserServices.getUserById(id)
        if (!user) throw new AppError('User not found', 404)
        
        //check for role. If user check for id authorized
        if(req.user.role !== 'admin' && req.user.id !== id) throw new AppError('Forbidden',403)     
        
        //validate req body
        const result = validatePartialSchema(userSchema, req.body)
        if(!result.success) {
            throw new AppError(JSON.parse(result.error).map(error => error.path + ': ' + error.message),400)
        }

        //update user
        const userUpdated = await UserServices.updateUser(id, result.data)        
        successResponse(res,userUpdated) 
    }
    static async deleteUser(req,res ){
        const {id} = req.params
        const userDeleted = await UserServices.deleteUser(id)
        if (!userDeleted) throw new AppError('User not found', 404)
        successResponse(res,userDeleted)
    }
}