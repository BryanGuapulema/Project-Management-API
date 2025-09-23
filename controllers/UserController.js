import { UserServices } from '../services/UserServices.js'
import {AppError} from '../utils/appError.js'
import { validatePartialSchema, validateSchema } from '../utils/validateSchema.js'
import { userSchema } from '../validations/userSchema.js'
import { successResponse } from '../utils/response.js'
import bcrypt from 'bcrypt'

export class UserController{
    static async getAllUsers(req,res){
        const users  = await UserServices.getAllUsers()
        successResponse(res,users)
    }

    static async getUserById(req,res){
        const {id} = req.params
        const user = await UserServices.getUserById(id)
        if (!user) throw new AppError('User not found', 404)
        successResponse(res,user)
    }

    static async createUser(req,res){
        const result = validateSchema(userSchema, req.body)
        if(!result.success) {
            throw new AppError(JSON.parse(result.error).map(error => error.path + ': ' + error.message),400)
        }

        const {password} = result.data
        const passwordHashed = await bcrypt.hash(password,10)

        const newUser = await UserServices.createUser({...result.data, password: passwordHashed})
        successResponse(res,newUser,201)
    }
    static async updateUser(req,res){
        const result = validatePartialSchema(userSchema, req.body)
        if(!result.success) {
            throw new AppError(JSON.parse(result.error).map(error => error.path + ': ' + error.message),400)
        }

        const {id} = req.params
        const userUpdated = await UserServices.updateUser(id, result.data)
        if (!userUpdated) throw new AppError('User not found', 404)
        successResponse(res,userUpdated) 
    }
    static async deleteUser(req,res ){
        const {id} = req.params
        const userDeleted = await UserServices.deleteUser(id)
        if (!userDeleted) throw new AppError('User not found', 404)
        successResponse(res,userDeleted)
    }
}