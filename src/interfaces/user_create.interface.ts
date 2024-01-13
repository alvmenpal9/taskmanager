import { Document } from "mongoose";

export interface UserInterface extends Document{
    name: string,
    surname: string,
    username: string,
    password: string,
    role?: string
}

export interface UserInterfaceWOPass extends Document{
    name: string,
    surname: string,
    username: string,
    role?: string
}