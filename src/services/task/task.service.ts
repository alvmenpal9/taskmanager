import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import mongoose, { Model } from 'mongoose';
import { CreateTaskDto } from 'src/dto/task/create_task.dto';
import { UpdateTaskDtio } from 'src/dto/task/update_task.dto';
import { TaskInterface } from 'src/interfaces/task.interface';

@Injectable()
export class TaskService {

    constructor(@InjectModel('task') private Task: Model<TaskInterface>) { }

    async getAllTasks(): Promise<TaskInterface[]> {
        const tasks = await this.Task.find();
        return tasks;
    }

    async createTask(req: Request, body: CreateTaskDto): Promise<Object> {
        const { task } = body;
        const userId = new mongoose.Types.ObjectId(req?.user['sub']);

        try {
            const createdTask = await this.Task.create({
                user: userId,
                task: task
            })

            if (!createdTask) throw new HttpException('Could not create task', HttpStatus.BAD_REQUEST);

            return {
                status: 200,
                message: 'Task created',
                task: createdTask
            }
        } catch (error) {
            throw error
        }
    }

    async changeTaskStatus(idTask: string, body: UpdateTaskDtio, req: Request) {
        if (idTask.length !== 24) throw new HttpException(`Invalid ID`, HttpStatus.NOT_FOUND);

        try {
            const { status } = body;
            const taskFound = await this.Task.findOneAndUpdate({ _id: idTask, user: req?.user['sub'] }, {
                status: status
            });

            if (!taskFound) throw new HttpException(`Could not update task status`, HttpStatus.NOT_FOUND);

            return {
                status: 200,
                message: 'Task updated'
            }
        } catch (error) {
            throw error
        }
    }

    async retrieveUserTasks(req: Request, username: string) {
        if(req?.user['username'] !== username) throw new UnauthorizedException;

        try {
            const tasks = await this.Task.aggregate([
                {
                    $lookup: {from:'users', localField: 'user', foreignField: '_id', as: 'User'}
                },{
                    $unwind: '$User'
                },{
                    $match: {'User.username':username}
                },{
                    $project: {'User.password':0, 'user':0}
                }
            ]);
            return tasks
        } catch (error) {
            throw error
        }
    }

    async deleteTask(taskId:string, req:Request){
        if(taskId.length !== 24) throw new HttpException(`Invalid ID`, HttpStatus.NOT_FOUND);
        try {
            const userId = new mongoose.Types.ObjectId(req.user['sub']);
            const deletedTask = await this.Task.findOneAndDelete({_id:taskId, user:userId});
            if(deletedTask){
                return HttpStatus.OK;
            }
        } catch (error) {
            throw error
        }
    }

    async deleteCompletedTasks(req:Request){
        try {
            const tasksToRemove = await this.Task.find().deleteMany({status:'completed'});
            if(tasksToRemove){
                return {
                    message: 'Completed tasks deleted'
                }
            }
        } catch (error) {
            throw error
        }
    }
}
