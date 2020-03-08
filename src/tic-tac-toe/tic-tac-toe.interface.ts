export interface TicTacToe {
  connection: String,
  players: {
    playerOne: String,
    playerTwo: String
  },
  plays: [{ playerOne: Number, playerTwo: Number }]
}
