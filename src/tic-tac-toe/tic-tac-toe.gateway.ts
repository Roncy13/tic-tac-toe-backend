import { SubscribeMessage, WebSocketGateway, OnGatewayDisconnect, OnGatewayConnection, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Players } from './game/players';
import { PlayerType } from '../utilities/define';

enum MessageType {
  Sucess= "success",
  Error= "error",
  Warning = "warning",
  Info = "info"
}

@WebSocketGateway(4001, { namespace: '/game' })
export class TicTacToeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  private games = new Players();

  afterInit(server: any): void {
    console.log("initialized");
  }

  async handleDisconnect(client: Socket) {
    this.emitDisconnection(client);
  }

  emitDisconnection(client: Socket) {
    const { id, room } = client;

    if (room != undefined) {
      const players = this.games.removePlayer(id, room) || {};
      this.wss.emit("players", { room, players });
    }
  }

  handleConnection(client: Socket): void {
    console.log("connected")
  }

  @SubscribeMessage("removePlayer")
  async removePlayer(client: Socket) {
    this.emitDisconnection(client);
  }

  @SubscribeMessage('createdRoom')
  async createdRoom(client: Socket, { room, name }) { 

    const checkRoom = this.games.checkRoom(room);
    if (!checkRoom) {
      this.games.checkSize(room, client.id, name, PlayerType.PlayerOne);
      this.games.setCreator(room, name);

      this.receivedRoom(client, room);
    } else {
      this.wss.to(client.id).emit("message", { message: "Room Already Created, Please Click Join Room", type: MessageType.Error });
    }
  }

  async receivedRoom(client, room: string) {
    await client.join(room);

    client.room = room;
    const gameClients = this.games.getClients(room);
    const gamePlace = this.games.getGames(room);
    const creator = this.games.getRoomCreator(room);
    const turn = (this.games.playersMustBeTwo(room)) ? this.games.whosTurn(room) : null;

    this.wss.in(room).emit("receivedRoom", { players: gameClients, game: gamePlace, creator, turn });
  }

  @SubscribeMessage('placeChip')
  async placeChip(client: Socket, { placeChip }) {
    try {
      const { id, room } = client,
        playable = this.games.playersMustBeTwo(room);

      // Check if two players are present

      if (!playable) {
        this.wss.to(client.id).emit("message", { message: "Wait For your opponent to Join in the Game...!", type: MessageType.Error });
        return;
      }

      const checkTurns = this.games.isItPlayersTurn(room, id);
      // Checks if your turn
      if (!checkTurns) {
        this.wss.to(client.id).emit("message", { message: "It's Your Oponnents Turn, Please wait for him to finish his turn...!", type: MessageType.Error });
        return;
      }

      // Applying Game Logic and Placing of Chips
      if (room != undefined) {
        const applied = this.games.applyChip(room, placeChip, id),
          games = this.games.getGames(room),
          message = applied ? "" : `You Cannot Place Already being filled by You or Other Player`;
      
        if (!applied) {
          this.wss.to(id).emit("message", { message, type: "error" });
        } else {
          const { result, score, winner, turn } = this.games.gameLogic(room);

          this.wss.in(room).emit("receivedChips", { games, turn });

          if (result) {
            this.wss.in(room).emit("winner", { winner, score, games });
          }

          this.wss.to(client.id).emit("message", { message: "It's Your Oponnents Turn", type: MessageType.Info });
          client.to(room).emit("message", { message: "Its Your Turn To Place Chip", type: MessageType.Info });
        }
      }
    } catch(err) {
      console.log(err);
    }
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, { room, name }) {
    const checkRoom = this.games.checkRoom(room);
    
    if (!checkRoom) {
      this.roomDoesNotExist(client);
    } else {
      const playerType = (this.games.getRoomCreator(room) == name) ? PlayerType.PlayerOne : PlayerType.PlayerTwo,
        bool = this.games.checkSize(room, client.id, name, playerType);

      if (bool) {
        this.receivedRoom(client, room);
      } else {
        this.roomDoesNotExist(client);
      }
    }
  }

  roomDoesNotExist(client): void {
    this.wss.to(client.id).emit("message", { message: "Room Does not Exist", type: MessageType.Error });
  }
}
