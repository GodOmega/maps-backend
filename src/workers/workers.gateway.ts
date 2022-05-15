import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

@WebSocketGateway( {
  cors: { origin: '*' },
})
export class WorkersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

  afterInit(server: any) {
    console.log('workers socket on')
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('alguien se conecto')
  }

  handleDisconnect(client: any) {
    console.log('alguien se desconecto')
  }

  @SubscribeMessage('join_work')
  handleMessage(client: any, payload: any): void {
    console.log('joined')
  }

  @SubscribeMessage('disconnect_work')
  handleDisconnectWork(client: any, payload: any): void {
    console.log(payload)
  }

  @SubscribeMessage('out_perimeter')
  handleOtPerimeter(client: any, payload: any): void {
    console.log(payload)
  }

  @SubscribeMessage('message')
  handleOtMessageTest(client: any, payload: any): void {
    console.log(payload)
  }
}
