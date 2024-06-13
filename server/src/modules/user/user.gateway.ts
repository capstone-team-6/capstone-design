import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { filter, from, map } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { Event, Message } from 'src/interfaces/entities/message';
import { FirebaseService } from '../util/firebase.service';
import { UserService } from './user.service';

@WebSocketGateway({ cors: '*' })
export class UserGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;
  // clients: Record<User['id'], { socket: Socket; position: string }>;

  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(FirebaseService) private firebaseService: FirebaseService,
  ) {
    // this.clients = {};
  }

  afterInit(server: Server) {
    // implement auth middleware
    server.use(async (socket, next) => {
      const firebaseAuth = this.firebaseService.getAuth();
      const { idToken } = socket.handshake.auth;

      if (idToken === undefined) return next(new Error('Cannot find id token'));

      try {
        const result = await firebaseAuth.verifyIdToken(idToken);
        socket.data.uid = result.uid;

        const user = await this.userService.getUser(result.uid);
        if (user === null) throw new Error('User is not registered yet');

        socket.data.group = user.group;

        next();
      } catch (e) {
        next(e);
      }
    });
  }

  @SubscribeMessage('position')
  async position(
    @MessageBody() data: Message[Event.POSITION],
    @ConnectedSocket() socket: Socket,
  ) {
    socket.data.position = data;

    const sockets = await this.server.fetchSockets();
    const groupSockets = sockets.filter((s) =>
      socket.data.group.includes(s.data.uid),
    );

    groupSockets.forEach((s) => {
      s.emit(Event.POSITION, {
        ...data,
        from: { uid: socket.data.uid },
      });
    });

    return from(groupSockets)
      .pipe(filter((s) => s.data.position !== undefined))
      .pipe(
        map((s) => ({
          ...s.data.position,
          from: { uid: s.data.uid },
        })),
      );
  }
}
