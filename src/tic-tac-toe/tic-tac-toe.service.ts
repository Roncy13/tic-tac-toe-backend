import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PlayerOneDTO, PlayerTwoDTO } from './dto/players.dto';
import * as uniqid from 'uniqid';
import { TicTacToe } from './tic-tac-toe.interface';
import { TicTacToeGateway } from './tic-tac-toe.gateway';

@Injectable()
export class TicTacToeService {

  constructor(
    @InjectModel('TicTacToe') private readonly model: Model<TicTacToe>,
    private gateWay: TicTacToeGateway
  ) {}

  async fetchAll() {
    return this.model.find({ score: { $gt: 0 } });
  }
}
