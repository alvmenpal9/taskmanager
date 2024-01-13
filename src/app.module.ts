import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MySchemas } from './config/database';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';
import { TaskService } from './services/task/task.service';
import { TaskController } from './controllers/task/task.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    MongooseModule.forRoot(process.env.DB_QUERY),
    MongooseModule.forFeature(MySchemas), 
  ],
  controllers: [AppController, UserController, AuthController, TaskController],
  providers: [AppService, UserService, AuthService, TaskService],
})
export class AppModule {}
