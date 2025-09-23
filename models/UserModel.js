import { Schema, model} from "mongoose"

const UserSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
},{
    timestamps: true
})

export const User = model('User', UserSchema)