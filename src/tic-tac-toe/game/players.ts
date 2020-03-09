import { range, isEmpty } from 'lodash';

export class Players {
  games;

  constructor() {
    this.games = {};
  }

  placeChip(room: string, id: string) {

  }

  playerInRoom(room: string, id: string) {
    let playerType: "",
      result = false;

    if (room in this.games) {
      const playerType = this.fetchPlayerType(id, room);
      
      console.log(playerType);
    }
  }

  fetchPlayerType(id: string, room: string) {
    const players = this.games[room].players,
        keys = Object.keys(players);

    const player = keys.filter(value => players[value].playerId == id);

    return player[0] || "";
  }


  removePlayer(id: string, room: string) {
    if (room in this.games) {
      const playerType = this.fetchPlayerType(id, room);
      
      if (!isEmpty(playerType)) {
        delete this.games[room].players[`${playerType}`];

        return this.games[room].players;
      }
    }
  }

  checkSize(room: string, playerId: string, playerName = "", playerType): boolean {
    const game = room in this.games ? this.games[room] : {},
      size = Object.keys(game.players || {}).length;

    if (size < 2) {
      if (size == 0) {
        this.games[room] = {
          tic_tac_toe: {},
          players: {}
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

  getClients(room) {
    return room in this.games ? this.games[room].players : {};
  }

  getGames(room) {
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
        return true;
      }
    }

    return false;
  }
}