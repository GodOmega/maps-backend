import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { WorkerService } from './services/worker.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class WorkersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private workerService: WorkerService) {}

  afterInit(server: any) {
    console.log('workers socket on');
  }

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`${client.id} se conecto`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`${client.id} se desconecto`);
    // this.workerService.workerDisconnected(
    //   params.employeId,
    //   client.id,
    //   'offline',
    // );
  }

  @SubscribeMessage('join_work')
  async handleMessage(client: Socket, payload: any) {
    const { employeId, group, enterpriseId, name } = payload;
    console.log('joining');

    if (group && employeId && group && enterpriseId) {
      const roomId = `${enterpriseId}-${group}`;
      const { room } = await this.workerService.workerConnected(
        employeId,
        client.id,
        roomId,
        name
      );

      this.server.to(roomId).emit("room_workers", room.workers)
    }
  }

  @SubscribeMessage('disconnect_work')
  handleDisconnectWork(client: Socket, payload: any): void {
    console.log(payload);
  }

  @SubscribeMessage('out_perimeter')
  handleOtPerimeter(client: Socket, payload: any): void {
    console.log(payload);
  }

  @SubscribeMessage('message')
  handleOtMessageTest(client: any, payload: any): void {
    console.log(payload);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(client: Socket, payload: any) {
    const { enterpriseId, groupId } = payload;

    const roomId = `${enterpriseId}-${groupId}`;

    if (enterpriseId && groupId) {
      client.join(roomId);
      const workers = await this.workerService.getClientsOnline(roomId);
      this.server.to(roomId).emit('room_workers', workers);
    }
  }
}
