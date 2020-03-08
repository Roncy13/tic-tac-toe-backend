import { Module } from '@nestjs/common';
import { TicTacToeController } from './tic-tac-toe.controller';
import { TicTacToeService } from './tic-tac-toe.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TicTacToeSchema } from './tic-tac-toe-schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'TicTacToe', schema: TicTacToeSchema }])],
  controllers: [TicTacToeController],
  providers: [TicTacToeService]
})
export class TicTacToeModule {}
