import { Controller, Post, Res, Body, Get, HttpStatus, Put } from '@nestjs/common';
import { Response } from 'express';
import { PlayerOneDTO, PlayerTwoDTO } from './dto/players.dto';
import { TicTacToeService } from './tic-tac-toe.service';
import { TicTacToe } from './tic-tac-toe.interface';

@Controller('tic-tac-toe')
export class TicTacToeController {

  constructor(private service: TicTacToeService) {}

  @Get()
  async fetchScores(@Res() response: Response) {
    const data = await this.service.fetchAll();
    return response.status(HttpStatus.OK).json(data);
  }
}
