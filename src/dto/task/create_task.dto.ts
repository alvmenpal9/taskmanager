import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateTaskDto{
    @IsNotEmpty({message: 'User cannot be empty'})
    user: string;

    @IsNotEmpty({message: `Task cannot be empty`})
    task: string;

    @IsOptional()
    status: string;
}