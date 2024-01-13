import { Body, Controller, Get, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { CreateTaskDto } from 'src/dto/task/create_task.dto';
import { UpdateTaskDtio } from 'src/dto/task/update_task.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { TaskService } from 'src/services/task/task.service';

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {

    constructor(private taskService:TaskService){}

    @Get()
    getAllTasks(){
        return this.taskService.getAllTasks();
    }

    @Post()
    createTask(@Req() req:Request, @Body() taskDto:CreateTaskDto){
        return this.taskService.createTask(req, taskDto);
    }

    @Put(':id')
    @UsePipes(ValidationPipe)
    changeStatus(@Param() params, @Body() dto:UpdateTaskDtio, @Req() req:Request){
        return this.taskService.changeTaskStatus(params.id, dto, req);
    }

}
