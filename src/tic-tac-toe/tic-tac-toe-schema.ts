import * as mongoose from 'mongoose';

const playSchema = new mongoose.Schema({ 
  1: String,
  2: String,
  3: String,
  4: String,
  5: String,
  6: String,
  7: String,
  8: String,
  9: String,
});

const PlayInfoSchema = new mongoose.Schema({
  playerId: String,
  playerName: String,
});

export const TicTacToeSchema = new mongoose.Schema({
  room: String,
  players: {
    playerOne: PlayInfoSchema,
    playerTwo: PlayInfoSchema
  },
  game: playSchema,
  winner: String,
  score: Number
});