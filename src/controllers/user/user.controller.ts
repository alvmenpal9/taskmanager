import { Controller, Get, Post, Put, Delete, ValidationPipe, UsePipes, Body, UseGuards, Req, Param } from '@nestjs/common';
import { PublicAccess } from 'src/decorators/public.decorator';
import { UserCreateDto } from 'src/dto/user/create.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {

    constructor(private userService:UserService){}

    @Get()
    getAllUsers(){
        return this.userService.getAll();
    }

    @Get(':id')
    getUserById(@Param() params){
        return this.userService.getUserById(params.id);
    }

    @PublicAccess()
    @Post()
    @UsePipes(ValidationPipe)
    createUser(@Body() userDto:UserCreateDto){
        return this.userService.createUser(userDto);
    }

    @Delete(':id')
    removeUser(@Param() params){
        return this.userService.removeUser(params.id);
    }

}