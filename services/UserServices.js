import { User } from "../models/UserModel.js"

export class UserServices{
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
        return await User.findByIdAndUpdate(id, data, {new: true})
    }
    static async deleteUser(id){
        return await User.findByIdAndDelete(id)
    }

    static async getUserByUsernameOrEmail(string){
        const user = User.findOne({name: string})
        if(user){
            return await user
        }else{
            return await User.findOne({email: string})
        }
    }
}