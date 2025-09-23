import { UserModel } from '../models/UserModel.js'
import {AppError} from '../utils/appError.js'
import { validatePartialSchema, validateSchema } from '../utils/validateSchema.js'
import { userSchema } from '../validations/userValidations.js'

export class UserController{
    static async getAllUsers(req,res){
        const users  = await UserModel.getAllUsers()
        return res.json(users)
    }

    static async getUserById(req,res,next){
        const {id} = req.params
        const user = await UserModel.getUserById(id)
        if (!user) throw new AppError('User not found', 404)
        res.json(user)
    }

    static async createUser(req,res){
        const result = validateSchema(userSchema, req.body)
        if(!result.success) {
            throw new AppError(JSON.parse(result.error).map(error => error.path + ': ' + error.message),400)
        }
        const newUser = await UserModel.createUser(result.data)
        res.status(201).json(newUser)

    }
    static async updateUser(req,res){
        const result = validatePartialSchema(userSchema, req.body)
        if(!result.success) {
            throw new AppError(JSON.parse(result.error).map(error => error.path + ': ' + error.message),400)
        }

        const {id} = req.params
        const userUpdated = await UserModel.updateUser(id, result.data)
        if (!userUpdated) throw new AppError('User not found', 404)
        res.json(userUpdated) 
    }
    static async deleteUser(req,res ){
        const {id} = req.params
        const userDeleted = await UserModel.deleteUser(id)
        if (!userDeleted) throw new AppError('User not found', 404)
        res.json(userDeleted)
    }
}