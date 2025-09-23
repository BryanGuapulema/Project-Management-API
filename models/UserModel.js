import mongoose from "mongoose"
import { User } from "../schemas/userSchema.js"

export class UserModel{
    static async getAllUsers(){
        return await User.find()
    }
    static async getUserById(id){
        return await User.findById(id)
    }
    static async createUser(data){
        return await User.create(data)
    }
    static async updateUser(id, data){
        return await User.findByIdAndDelete(id, data, {new: true})
    }
    static async deleteUser(id){
        return await User.findByIdAndDelete(id)
    }
}