import { Body, Controller, Get, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto } from 'src/dto/auth/login.dto';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('auth')
export class AuthController {

    constructor(private AuthService: AuthService) { }

    @Post('login')
    @UsePipes(ValidationPipe)
    handleLogin(@Body() loginDto: LoginDto, @Res() response: Response) {
        return this.AuthService.handleLogin(loginDto, response);
    }

    @Get('refresh')
    handleRefreshToken(@Req() req: Request, @Res() res: Response) {
        return this.AuthService.handleRefreshToken(req, res);
    }

    @Get('logout')
    handleLogout(@Req() req: Request, @Res() res: Response) {
        return this.AuthService.handleLogout(req,res)
    }

}
