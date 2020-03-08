import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GameExistMiddleware } from './tic-tac-toe/policies/game-exist';
import { TicTacToeModule } from './tic-tac-toe/tic-tac-toe.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/tic_tac_toe'), TicTacToeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GameExistMiddleware)
      .forRoutes({ path: 'tic-tac-toe/player-two', method: RequestMethod.PUT });
  }
}
