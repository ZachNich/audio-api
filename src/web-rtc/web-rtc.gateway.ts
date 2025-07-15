import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketEvents } from 'src/enums/socket.enum';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    credentials: false, //TODO: handle creds
  },
})
export class WebRtcGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    //TODO
  }

  handleDisconnect(client: Socket) {
    //TODO
  }

  @SubscribeMessage(SocketEvents.offer)
  handleOffer(
    @MessageBody() offer: RTCSessionDescriptionInit,
    @ConnectedSocket() client: Socket, //TODO
  ) {
    this.server.emit(SocketEvents.offer, {
      offer: offer,
    });
  }

  @SubscribeMessage(SocketEvents.answer)
  handleAnswer(
    @MessageBody() answer: RTCSessionDescriptionInit,
    @ConnectedSocket() client: Socket, //TODO
  ) {
    this.server.emit(SocketEvents.answer, {
      answer: answer,
    });
  }

  @SubscribeMessage(SocketEvents.iceCandidate)
  handleIceCandidate(
    @MessageBody() candidate: RTCIceCandidateInit,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit(SocketEvents.iceCandidate, { candidate: candidate });
  }
}
