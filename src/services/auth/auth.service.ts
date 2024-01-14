import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from 'src/dto/auth/login.dto';
import { UserInterface } from 'src/interfaces/user_create.interface';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { TokenPayload, TokenPayloadVerify } from 'src/interfaces/auth.interface';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {

    constructor(@InjectModel('user') private User: Model<UserInterface>) { }

    signJwt(payload: string | Object, secretKey: string, duration: string) {
        return jwt.sign(payload, secretKey, { expiresIn: duration });
    }

    async handleLogin(loginDto: LoginDto, response: Response): Promise<Object> {
        const { username, password } = loginDto;

        const userFound = await this.User.findOne({ username: username });
        if (!userFound) throw new HttpException(`Incorrect username or password`, HttpStatus.NOT_FOUND);

        const pwdMatches = bcrypt.compareSync(password, userFound.password);
        if (!pwdMatches) throw new HttpException(`Incorrect username or password`, HttpStatus.NOT_FOUND);

        const payload: TokenPayload = {
            sub: userFound._id,
            name: userFound.name + ' ' + userFound.surname,
            username: userFound.username,
            role: userFound.role
        }

        const accessToken = this.signJwt(payload, process.env.ACCESS_TOKEN, '30m');
        const refreshToken = this.signJwt(payload, process.env.REFRESH_TOKEN, '1h');

        response.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        return response.status(200).json({
            username: userFound.username,
            role: userFound.role,
            accessToken: accessToken
        });
    }

    async handleRefreshToken(req: Request, res: Response) {
        const token: string = req?.cookies?.jwt;
        if (!token) throw new HttpException(`Invalid Token`, HttpStatus.FORBIDDEN)

        jwt.verify(
            token,
            process.env.REFRESH_TOKEN,
            (error, decode: TokenPayloadVerify) => {
                if (error) {
                    throw new HttpException(`Token already expired`, HttpStatus.UNAUTHORIZED);
                }

                const newPayload: TokenPayload = {
                    sub: decode.sub,
                    name: decode.name,
                    username: decode.username,
                    role: decode.role
                }

                const newAccessToken = this.signJwt(newPayload, process.env.ACCESS_TOKEN, '30m');

                return res.status(200).json({
                    username: newPayload.username,
                    role: newPayload.role,
                    accessToken: newAccessToken
                });
            }
        )
    }

    async handleLogout(req: Request, res: Response) {
        if (!req?.cookies?.jwt) {
            res.sendStatus(204);
        } else {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
            res.sendStatus(204);
        }
    }

}
