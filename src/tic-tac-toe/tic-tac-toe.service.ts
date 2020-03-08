import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PlayerOneDTO } from './dto/players.dto';
import * as uniqid from 'uniqid';
import { TicTacToe } from './tic-tac-toe.interface';

@Injectable()
export class TicTacToeService {

  constructor(@InjectModel('TicTacToe') private readonly model: Model<TicTacToe>) {}

  async create(body: PlayerOneDTO): Promise<TicTacToe> {
    body.connection = uniqid();

    const { playerOne, connection } = body;
    const newGame = {
      players: {
        playerOne
      },
      connection
    }, result = new this.model(newGame);

    return result.save();
  }
}
