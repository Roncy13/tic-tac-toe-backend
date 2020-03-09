import { SubscribeMessage, WebSocketGateway, OnGatewayDisconnect, OnGatewayConnection, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Players } from './game/players';
import { isEmpty } from 'lodash';

enum PlayerType {
  PlayerOne = "PlayerOne",
  PlayerTwo = "PlayerTwo" 
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

      console.log(this.wss.emit);

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
    this.games.checkSize(room, client.id, name, PlayerType.PlayerOne);

    this.receivedRoom(client, room);
  }

  async receivedRoom(client, room: string) {
    await client.join(room);

    client.room = room;
    const gameClients = this.games.getClients(room);
    const gamePlace = this.games.getGames(room);

    this.wss.in(room).emit("receivedRoom", { players: gameClients, game: gamePlace });
  }

  @SubscribeMessage('placeChip')
  async placeChip(client: Socket, { room, placeChip }) {
    console.log(client.id, room, placeChip);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, { room, name }) {
    const bool = this.games.checkSize(room, client.id, name, PlayerType.PlayerTwo);

    if (bool) {
      this.receivedRoom(client, room);
    }  
  }
}
