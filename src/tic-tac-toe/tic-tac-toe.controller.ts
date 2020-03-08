import { Controller, Post, Res, Body, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { Response } from 'express';
import { PlayerOneDTO, PlayerTwoDTO } from './dto/players.dto';
import { TicTacToeService } from './tic-tac-toe.service';
import { TicTacToe } from './tic-tac-toe.interface';

@Controller('tic-tac-toe')
export class TicTacToeController {

  constructor(private service: TicTacToeService) {}

  @Post("/player-one")
  async playerOne(
    @Body() body: PlayerOneDTO,
    @Res() response: Response): Promise<Response> {

    const playerOne: TicTacToe = await this.service.create(body),
      result = {
        data: playerOne,
        message: `Player One Created Successfully`
      };
    
    return response.status(HttpStatus.CREATED).json(result);
  }

  @Put("/player-two")
  async playerTwo(
    @Body() body: PlayerTwoDTO,
    @Res() response: Response
  ): Promise<Response> {

    const game: TicTacToe = await this.service.joinPlayerTwo(body);
    const result = {
      data: game,
      message: `${ game.players.playerTwo } can now join the game...!`
    };
    return response.status(HttpStatus.OK).json(result);
  }
}
