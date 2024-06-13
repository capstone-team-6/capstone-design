import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from 'src/interfaces/entities/user';
import { Server, WebSocket } from 'ws';
import { UserService } from './user.service';

@WebSocketGateway()
export class UserGateway {
  @WebSocketServer()
  server: Server;
  clients: Record<User['id'], { socket: WebSocket; position: string }>;

  constructor(@Inject(UserService) private userService: UserService) {
    this.clients = {};
  }

  @SubscribeMessage('position')
  async onRegister(
    @MessageBody()
    body: {
      id: string;
      target: string[];
      buildingId: string;
      markerId: string;
    },
    @ConnectedSocket() socket: WebSocket,
  ) {
    const { id, buildingId, markerId, target } = body;

    if (this.clients[id] === undefined) {
      this.clients[id] = {
        position: markerId,
        socket,
      };

      target.forEach((targetId) => {
        const client = this.clients[targetId];
        if (client !== undefined) {
          this.send(socket, {
            id: targetId,
            position: client.position,
          });
        }
      });
    }

    this.clients[id].position = markerId;

    target.forEach((targetId) => {
      const client = this.clients[targetId];
      if (client !== undefined) {
        this.send(client.socket, {
          id,
          position: markerId,
        });
      }
    });

    // return true;
  }

  private send<T extends { id: string; position: string }>(
    socket: WebSocket,
    data: T,
  ) {
    socket.send(JSON.stringify(data), (err) => {
      if (!err) return;
      for (const userId in this.clients) {
        if (this.clients[userId].socket.url === socket.url) {
          delete this.clients[userId];
          return;
        }
      }
    });
  }
}
