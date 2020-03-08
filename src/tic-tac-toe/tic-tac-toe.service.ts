import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PlayerOneDTO, PlayerTwoDTO } from './dto/players.dto';
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
      connection,
      winner: null
    }, result = new this.model(newGame);

    return result.save();
  }

  async findExisting(connection: string): Promise<TicTacToe> {
    return this.model.findOne({ connection }).exec();
  }

  async joinPlayerTwo({ playerTwo, connection }: PlayerTwoDTO): Promise<TicTacToe> {
    return this.model.findOneAndUpdate({ connection }, {"$set": { "players.playerTwo": playerTwo } }).exec();
  }
}
