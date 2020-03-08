import { Module } from '@nestjs/common';
import { TicTacToeController } from './tic-tac-toe.controller';
import { TicTacToeService } from './tic-tac-toe.service';

@Module({
  controllers: [TicTacToeController],
  providers: [TicTacToeService]
})
export class TicTacToeModule {}
