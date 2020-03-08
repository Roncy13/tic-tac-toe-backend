import * as mongoose from 'mongoose';

const playSchema = new mongoose.Schema({ playerOne: Number, playerTwo: Number });

export const TicTacToe = new mongoose.Schema({
  connection: String,
  players: {
    playerOne: String,
    playerTwo: String
  },
  plays: [{}]
});



export const CatSchema = new mongoose.Schema({
  name: String,
  age: Number,
  breed: String,
});