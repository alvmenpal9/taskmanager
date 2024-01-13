import { IsNotEmpty } from "class-validator";

export class LoginDto{
    @IsNotEmpty({message: 'Username cannot be empty'})
    username: string;

    @IsNotEmpty({message: 'Password cannot be empty'})
    password: string;
}