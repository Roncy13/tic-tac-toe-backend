import { IsNotEmpty, IsString, IsEmpty } from 'class-validator';

export class PlayerOneDTO {
  @IsNotEmpty()
  @IsString()
  playerOne: string;
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