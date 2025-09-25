import { model, Schema } from "mongoose"

const ListSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    position:{
        type: Number        
    }
},
{
    timestamps: true
})

export const List = model('List',ListSchema)