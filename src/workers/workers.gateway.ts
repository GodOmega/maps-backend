import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { WorkerService } from './services/worker.service';

@WebSocketGateway({
  cors: { origin: process.env.SOCKET_DOMAIN || '*' },
})
export class WorkersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private workerService: WorkerService) {}

  afterInit(server: any) {
    console.log('workers socket on');
  }

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket, ...args: any[]) {}

  async handleDisconnect(client: Socket) {
    try {
      const room = await this.workerService.workerDisconnected(client.id);

      if (room) {
        const workersOnline = await this.workerService.getClientsOnline(
          room.id,
        );
        this.server.to(room.id).emit('room_workers', workersOnline);
      }
    } catch (error) {
      throw new WsException('Ha ocurrido un error en la conexion');
    }
  }

  @SubscribeMessage('join_work')
  async handleJoinWork(client: Socket, payload: any) {
    try {
      const { employeId, group, enterpriseId, name, lastname } = payload;

      if (group && employeId && group && enterpriseId) {
        const roomId = `${enterpriseId}-${group}`;
        const { room } = await this.workerService.workerConnected(
          employeId,
          client.id,
          roomId,
          name,
          lastname,
        );

        const workersOnline = await this.workerService.getClientsOnline(roomId);

        this.server.to(roomId).emit('room_workers', workersOnline);
      }
    } catch (error) {
      throw new WsException('Ha ocurrido un error en la conexion');
    }
  }

  @SubscribeMessage('disconnect_work')
  async handleDisconnectWork(client: Socket, payload: any) {
    try {
      const room = await this.workerService.workerDisconnected(client.id);

      const workersOnline = await this.workerService.getClientsOnline(room.id);

      this.server.to(room.id).emit('room_workers', workersOnline);
    } catch (error) {
      throw new WsException('Ha ocurrido un error en la conexion');
    }
  }

  @SubscribeMessage('start_lunch')
  async handleLunch(client: Socket) {
    try {
      const { room } = await this.workerService.workerLunch(client.id);

      const workersOnline = await this.workerService.getClientsOnline(room.id);
      this.server.to(room.id).emit('room_workers', workersOnline);
    } catch (error) {
      throw new WsException('Ha ocurrido un error en la conexion');
    }
  }

  @SubscribeMessage('stop_lunch')
  async handleStopLunch(client: Socket) {
    try {
      const room = await this.workerService.workerDisconnected(client.id);

      const workersOnline = await this.workerService.getClientsOnline(room.id);
      this.server.to(room.id).emit('room_workers', workersOnline);
    } catch (error) {
      throw new WsException('Ha ocurrido un error en la conexion');
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(client: Socket, payload: any) {
    try {
      const { enterpriseId, groupId } = payload;

      const roomId = `${enterpriseId}-${groupId}`;

      if (enterpriseId && groupId) {
        client.join(roomId);
        const workers = await this.workerService.getClientsOnline(roomId);
        this.server.to(roomId).emit('room_workers', workers);
      }
    } catch (error) {
      throw new WsException('Ha ocurrido un error en la conexion');
    }
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload) {}
}
