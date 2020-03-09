import { SubscribeMessage, WebSocketGateway, OnGatewayDisconnect, OnGatewayConnection, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Players } from './game/players';

@WebSocketGateway(4001, { namespace: '/game' })
export class TicTacToeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway');
  private games = new Players();

  afterInit(server: any) {
    console.log("initialized");
  }

  /*@SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
    this.wss.to(message.room).emit('chatToClient', message);
  }*/

  handleDisconnect(client: Socket) {
    console.log("disconnect");
  }

  handleConnection(client: Socket) {
    console.log("connected")
  }

  @SubscribeMessage('createdRoom')
  async createdRoom(client: Socket, { room }) {
    try {
      await client.join(room);
      
      this.games.checkSize(room, client.id, "PlayerOne");
      
      console.log(this.games.getClients(room));
      this.wss.in(room).emit("receivedRoom", { room })
    } catch(err) {
      console.log(err);
    }
    
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, { room }) {
    try {
      const bool = this.games.checkSize(room, client.id, "PlayerTwo");

      if (bool) {
        await client.join(room);
        console.log(this.games.getClients(room));
        this.wss.in(room).emit("receivedRoom", { room })
      }
      
    } catch(err) {
      console.log(err);
    }    
  }


  @SubscribeMessage('playerOne')
  async placeTicTacToe(client: Socket, value) {
    client.join("sample-room").emit("result", { value });
    // await client.join(room);
    // this.wss.to(room).emit("receivedRoom", { room })
  }

  async setPayloadInRoom(client: Socket) {
    const payload = { sampleData: "data" };
    /*const data = () => setInterval(() => { 
      client.emit("receivedEventsFromRoom", payload);
      console.log(payload);
    } , 3000);
    setTimeout(() => data(), 2000)*/
  }


  /*@SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, room: string ) {
    client.leave(room);
    client.emit('leftRoom', room);
  }*/
}
