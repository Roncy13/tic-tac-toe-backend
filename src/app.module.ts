import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TicTacToeModule } from './tic-tac-toe/tic-tac-toe.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [MongooseModule.forRoot(process.env.mongo), TicTacToeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
