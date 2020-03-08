import { IsNotEmpty, IsString } from 'class-validator';

export class PlayerOneDTO {
  @IsNotEmpty()
  @IsString()
  playerOne: string;

  @IsString()
  connection: string;
}

export class PlayerTwoDTO {
  @IsNotEmpty()
  @IsString()
  playerTwo: string;

  @IsNotEmpty()
  @IsString()
  connection: string; 
}