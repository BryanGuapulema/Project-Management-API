import { UserModel } from '../models/UserModel.js'
import {AppError} from '../utils/appError.js'

export class UserController{
    static async getAllUsers(req,res){
        const users  = await UserModel.getAllUsers()
        return res.json(users)
    }
    static async getUserById(req,res,next){
        const {id} = req.params
        if (!user) throw new AppError('User not found', 404)
        res.json(user)
    }
    static async createUser(req,res){
        return
    }
    static async updateUser(req,res){
        return 
    }
    static async deleteUser(req,res ){
        return 
    }
}