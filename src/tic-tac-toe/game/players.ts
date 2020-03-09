import { range } from 'lodash';

export class Players {
  games;

  constructor() {
    this.games = {};
    this.checkSize = this.checkSize.bind(this);
  }

  checkSize(room: string, playerId: string, playerType) {
    
    const players = room in this.games ? this.games[room] : {},
      size = Object.keys(players).length;

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
        [playerType]: playerId
      };

      return true;
    } else {
      return false;
    }
  }

  getClients(room) {
    return room in this.games ? this.games[room].tic_tac_toe : {};
  }

  getGames(room) {
    return room in this.games ? this.games[room].players : {};
  }
}