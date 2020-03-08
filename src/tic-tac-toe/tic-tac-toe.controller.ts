import { Controller, Post, Res, Body, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { Response } from 'express';
import { PlayerOneDTO, PlayerTwoDTO } from './dto/players.dto';

@Controller('tic-tac-toe')
export class TicTacToeController {

  @Post("/player-one")
  async playerOne(
    @Body() body: PlayerOneDTO,
    @Res() response: Response): Promise<Response> {

    return response.status(HttpStatus.CREATED).json(body);
  }

  @Put("/player-two")
  async playerTwo(
    @Body() body: PlayerTwoDTO,
    @Res() response: Response
  ): Promise<Response> {

    return response.status(HttpStatus.OK).json(body);
  }
}
