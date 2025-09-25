import { Schema, model} from "mongoose"

const BoardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'hold'],
        default: 'active'
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true
})

export const Board = model('Board', BoardSchema)