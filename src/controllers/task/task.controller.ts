import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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

    @Get(':username')
    retrieveUserTasks(@Req() req:Request, @Param() params){
        return this.taskService.retrieveUserTasks(req, params?.username);
    }

    @Delete('removeCompleted')
    removeCompletedTasks(@Req() req:Request){
        return this.taskService.deleteCompletedTasks(req);
    }

    @Delete(':id')
    deleteTask(@Param() params, @Req() req:Request){
        return this.taskService.deleteTask(params.id, req);
    }

}
