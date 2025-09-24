import { Schema, model} from "mongoose"

const BoardSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    description:{
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'hold']
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
},{
    timestamps: true
})

export const Board = model('Board', BoardSchema)