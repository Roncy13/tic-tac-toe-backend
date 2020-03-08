import * as mongoose from 'mongoose';

const playSchema = new mongoose.Schema({ playerOne: Number, playerTwo: Number });

export const TicTacToeSchema = new mongoose.Schema({
  connection: String,
  players: {
    playerOne: String,
    playerTwo: String
  },
  plays: [playSchema],
  winner: String,
  score: Number
});