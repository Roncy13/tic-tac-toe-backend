import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { TicTacToeService } from '../tic-tac-toe.service';
import { PlayerTwoDTO } from '../dto/players.dto';
import { isEmpty } from 'lodash';
import { TicTacToe } from '../tic-tac-toe.interface';

@Injectable()
export class GameExistMiddleware implements NestMiddleware {

  constructor(private readonly service: TicTacToeService) {}

  async use(req: Request, res: Response, next: Function) {
    
    const { connection } = req.body as PlayerTwoDTO;

    if (isEmpty(connection)) {
      next();
    } else {
      const findGame: TicTacToe = await this.service.findExisting(connection);

      if (isEmpty(findGame)) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: "Game Not Found"
        });
      } else if (findGame.winner !== null) {
        res.status(HttpStatus.NOT_ACCEPTABLE).json({
          message: "Game is already finished, cannot join the game."
        });
      }
      next();
    }
  }
}
