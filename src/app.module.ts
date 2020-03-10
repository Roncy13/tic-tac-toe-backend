import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TicTacToeModule } from './tic-tac-toe/tic-tac-toe.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/tic_tac_toe'), TicTacToeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
