import { Document } from "mongoose";

export interface TaskInterface extends Document{
    user: string,
    task: string,
    status?: string
}