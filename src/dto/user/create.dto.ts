import { IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class UserCreateDto {
    @IsNotEmpty({message: 'Name cannot be empty'})
    @MinLength(2, {message: 'Name must be at least 2 characters'})
    name: string;

    @IsNotEmpty({message: 'Surname cannot be empty'})
    @MinLength(2, {message: 'Surname must be at least 2 characters'})
    surname: string;

    @IsNotEmpty({message: 'Username cannot be empty'})
    @MinLength(5, {message: 'Username must be at least 5 characters'})
    username: string;

    @IsNotEmpty({message: 'Password cannot be empty'})
    @MinLength(4, {message: 'Password must be at least 4 characters'})
    password: string;

    @IsOptional()
    @IsNotEmpty()
    role: string;
}