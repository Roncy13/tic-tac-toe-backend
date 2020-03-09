import { Module } from '@nestjs/common';
import { TicTacToeController } from './tic-tac-toe.controller';
import { TicTacToeService } from './tic-tac-toe.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TicTacToeSchema } from './tic-tac-toe-schema';
import { TicTacToeGateway } from './tic-tac-toe.gateway';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'TicTacToe', schema: TicTacToeSchema }])],
  controllers: [TicTacToeController],
  providers: [TicTacToeService, TicTacToeGateway],
  exports: [TicTacToeService, TicTacToeGateway]
})
export class TicTacToeModule {}
