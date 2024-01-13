import { Schema } from "mongoose"

export const TaskSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    task: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    }
}, {
    timestamps: false,
    versionKey: false
});