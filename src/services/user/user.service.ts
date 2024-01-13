import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCreateDto } from 'src/dto/user/create.dto';
import { UserInterface, UserInterfaceWOPass } from 'src/interfaces/user_create.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(@InjectModel('user') private User: Model<UserInterface>) { }

    async getAll(): Promise<UserInterface[]> {
        try {
            const users = await this.User.find().select({ password: 0 });
            return users;
        } catch (error) {
            console.error(error);
        }
    }

    async getUserById(id: string): Promise<UserInterfaceWOPass> {
        if (id.length !== 24) throw new HttpException('Invalid ID', HttpStatus.NOT_FOUND);

        try {
            const userFound: UserInterfaceWOPass = await this.User.findOne({ _id: id }).select({ password: 0 });
            if (!userFound) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

            return userFound;
        } catch (error) {
            console.error(error);
        }
    }

    async createUser(userDto: UserCreateDto): Promise<Object> {
        const userExists = await this.User.findOne({ username: userDto.username });
        if (userExists) throw new HttpException(`User already exists`, HttpStatus.BAD_REQUEST);
        try {
            const createdUser = await this.User.create({
                name: userDto.name,
                surname: userDto.surname,
                username: userDto.username,
                password: bcrypt.hashSync(userDto.password, 10),
                role: userDto?.role
            });
            if (!createdUser) throw new HttpException(`Could not create user`, HttpStatus.BAD_REQUEST);

            return {
                status: HttpStatus.OK,
                message: 'User created successfully'
            }
        } catch (error) {
            console.error(error);
        }
    }

    async removeUser(id: string) {
        if (id.length !== 24) throw new HttpException('Invalid ID', HttpStatus.NOT_FOUND);

        try {
            const userFound: UserInterface = await this.User.findOneAndDelete({ _id: id });
            if (!userFound) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

            return {
                status: 200,
                message: 'User deleted'
            };
        } catch (error) {
            console.error(error);
        }
    }
}
