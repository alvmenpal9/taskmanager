import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateTaskDtio{
    @IsNotEmpty({message: 'Status cannot be empty'})
    status: string;
}