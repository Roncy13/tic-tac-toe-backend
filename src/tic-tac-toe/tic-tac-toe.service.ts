import { Injectable } from '@nestjs/common';
import { TicTacToe } from './tic-tac-toe';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TicTacToeService {

  constructor(@InjectModel('TicTacToe') private readonly model: Model<TicTacToe>) {}
}
