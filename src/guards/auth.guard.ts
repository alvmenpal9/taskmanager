import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PUBLIC_KEY } from "src/constants/key-decorator";
import { TokenPayloadVerify } from "src/interfaces/auth.interface";
import * as jwt from 'jsonwebtoken';
import { Request } from "express";
import { UserService } from "src/services/user/user.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserInterface } from "src/interfaces/user_create.interface";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
        @InjectModel('user') private readonly User: Model<UserInterface>
    ) { }

    async canActivate(context: ExecutionContext) {

        const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler());
        if (isPublic) return true;

        const req = context.switchToHttp().getRequest<Request>();
        const token = req?.headers?.authorization;
        if (!token) throw new UnauthorizedException(`Invalid token`);

        jwt.verify(
            token,
            process.env.ACCESS_TOKEN,
            (err, decode: TokenPayloadVerify) => {
                if (err) throw new HttpException(`Token expired`, HttpStatus.UNAUTHORIZED);
                req.user = {
                    sub: decode.sub,
                    name: decode.name,
                    username: decode.username,
                    role: decode.role
                }

                return true
            }
        )

        return true

    }
}