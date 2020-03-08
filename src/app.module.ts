import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TicTacToeModule } from './tic-tac-toe/tic-tac-toe.module';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/tic_tac_toe'), TicTacToeModule, PlayersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
