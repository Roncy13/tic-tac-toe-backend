import { range, isEmpty, uniq, cloneDeep, values } from 'lodash';
import { PlayerType } from '../../utilities/define';


export class Players {
  games;

  constructor() {
    this.games = {};
  }

  fetchPlayerType(id: string, room: string): String {
    const players = this.games[room].players,
        keys = Object.keys(players);

    const player = keys.filter(value => players[value].playerId == id);

    return player[0] || "";
  }


  removePlayer(id: string, room: string): Object {
    if (room in this.games) {
      const playerType = this.fetchPlayerType(id, room);
      
      if (!isEmpty(playerType)) {
        delete this.games[room].players[`${playerType}`];

        return this.games[room].players;
      }
    }
  }

  gameLogic(room: string): { result: Boolean, score: number, winner: string, turn: string, draw: Boolean } {
    let process = [],
      result = false,
      score = 0,
      winner = "",
      { turn } = this.games[room];

    process.push(this.checkLeftToRight(room));
    process.push(this.checkUpToBottom(room));
    process.push(this.checkDiagonals(room));

    result = process.includes(true);

    if (result) {
      const { winner: inGameWinner, score: inGameScore } = this.games[room];

      score = inGameScore;
      winner = inGameWinner
    }

    const pieces = values(this.games[room].tic_tac_toe) || [];
    const draw = !pieces.includes(null)

    return { result, score, winner, turn, draw };
  }

  checkLeftToRight(room: string): Boolean {
    const games = this.getGames(room),
      length = Object.keys(games).length;

    let score = 0,
      result = [];

    // loops by three
    for (let i = 1; i <= length; i ++) {
      result.push(games[i]);

      score += i;
      
      // when three, then check results
      if (i % 3 === 0) {
        if (this.checkWinner(result, room, score)) {
          return true;
        }

        result = [];
        score = 0;
      }
    }
    
    return this.games[room].score > 0;
  }

  checkWinner(playerChips: String[], room: String, score: number): boolean {
    const players = uniq(playerChips);

    if (players.length == 1 && !players.includes(null)) {
      const key = players[0];
      const winnerName = this.getClients(room)[`${key}`].playerName;
      this.games[`${room}`].winner = cloneDeep(winnerName);
      this.games[`${room}`].score = cloneDeep(score);

      return true;
    }

    return false;
  }

  checkUpToBottom(room: string): Boolean {
    const games = this.getGames(room),
      length = Object.keys(games).length;

    let score = 0,
      result = [];
    
    // deternmines the base
    for (let firstRow = 1; firstRow <= length / 3; firstRow++) {
      
      // loop downwards
      
      const secondRow = firstRow + 3,
        thirdRow = firstRow + 6;
      
      result.push(games[firstRow]);
      result.push(games[secondRow]);
      result.push(games[thirdRow]);

      score = firstRow + secondRow + thirdRow;

      if (this.checkWinner(result, room, score)) {
        return true;
      }

      result = [];
      score = 0;
    }

    return this.games[room].score > 0;
  }

  checkDiagonals(room: string): Boolean {
    const games = this.getGames(room),
      sideAKeys = Array(3).fill(0).map((row, index) => (index * 4) + 1),
      sideBKeys = Array(3).fill(0).map((row, index) => (index * 2) + 3),
      scoreA = sideAKeys.reduce((acc, val) => acc + val || 0, 0),
      scoreB = sideBKeys.reduce((acc, val) => acc + val || 0, 0),
      chipsA = sideAKeys.map(row => games[row]),
      chipsB = sideBKeys.map(row => games[row]);

    if (this.checkWinner(chipsA, room, scoreA)) {
      return true;
    } else if (this.checkWinner(chipsB, room, scoreB)) {
      return true;
    } else {
      return false;
    }
  }

  fetchAllInGame(room) {
    return this.games[room]
  }

  checkSize(room: string, playerId: string, playerName = "", playerType): Boolean {
    const game = room in this.games ? this.games[room] : {},
      size = Object.keys(game.players || {}).length,
      checkCreator = !(Object.keys(game).includes("creator"));

    if (size < 2) {
      if (size == 0 && checkCreator) {
        this.games[room] = {
          tic_tac_toe: {},
          players: {},
          score: 0,
          creator: "",
          turn: playerType
        };
        
        range(1, 10).forEach(element => {
          this.games[room].tic_tac_toe = {
            ...this.games[room].tic_tac_toe,
            [element]: null
          };
        });
      }

      this.games[room].players = {
        ...this.games[room].players,
        [playerType]: {
          playerId,
          playerName
        }
      };

      return true;
    } else {
      return false;
    }
  }

  setCreator(room: string, name: string): void {
    this.games[room].creator = name;
  }

  getClients(room): Object {
    return room in this.games ? this.games[room].players : {};
  }

  checkRoom(room: string): Boolean {
    return room in this.games;
  }

  getRoomCreator(room): string {
    return this.checkRoom(room) ? this.games[room].creator : "";
  }

  getRooms() {
    return this.games;
  }

  getGames(room): Object {
    return room in this.games ? this.games[room].tic_tac_toe : {};
  }

  applyChip(room: string, placeChip: string, playerId: string): boolean {
    const game = this.getGames(room);

    if (!isEmpty(game)) {
      const players = this.getClients(room),
        keys = Object.keys(players),
        playerType = keys.filter(value => players[value].playerId == playerId)[0] || null;


      if (game[placeChip] == null) {
        this.games[room].tic_tac_toe[placeChip] = playerType;
        this.turnNextPlayer(room);
        return true;
      }
    }
    return false;
  }

  turnNextPlayer(room): void {
    const currentPlayer = this.games[room].turn;

    if (currentPlayer == PlayerType.PlayerOne) {
      this.games[room].turn = PlayerType.PlayerTwo
    } else {
      this.games[room].turn = PlayerType.PlayerOne
    }
  }

  isItPlayersTurn(room: string, playerId: string) : Boolean {
    const { players } = this.games[room],
      keys = Object.keys(players);

    const result = keys.filter(row => players[row].playerId == playerId)[0];

    return result == this.games[room].turn;
  }

  whosTurn(room: string) : String {
    return this.games[room].turn;
  }

  playersMustBeTwo(room: string): Boolean {
    const { players } = this.games[room];

    return Object.keys(players).length === 2;
  }

  removeRoom(room: string): void {

    delete this.games[room];
  }
}