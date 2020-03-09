import { SubscribeMessage, WebSocketGateway, OnGatewayDisconnect, OnGatewayConnection, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Players } from './game/players';
import { isEmpty } from 'lodash';

enum PlayerType {
  PlayerOne = "PlayerOne",
  PlayerTwo = "PlayerTwo" 
}

enum MessageType {
  Sucess= "success",
  Error= "error",
  Warning= "warning"
}

@WebSocketGateway(4001, { namespace: '/game' })
export class TicTacToeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway');
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

    this.wss.in(room).emit("receivedRoom", { players: gameClients, game: gamePlace, creator });
  }

  @SubscribeMessage('placeChip')
  async placeChip(client: Socket, { placeChip }) {
    const { id, room } = client;

    if (room != undefined) {
      const applied = this.games.applyChip(room, placeChip, id),
        games = this.games.getGames(room),
        message = applied ? "" : `You Cannot Place Already being filled by You or Other Player`;
    
      if (!applied) {
        this.wss.to(id).emit("message", { message, type: "error" });
      } else {
        const { result, score, winner } = this.games.gameLogic(room);

        this.wss.in(room).emit("receivedChips", { games });

        if (result) {
          this.wss.in(room).emit("winner", { winner, score, games });
        }
      }
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
