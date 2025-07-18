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

//TODO: add return types to npm lib to share between front & back
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    credentials: false, //TODO: handle creds
  },
})
export class WebRtcGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private readonly roomsUsersMap = new Map<string, Set<string>>();

  handleConnection(client: Socket, ...args: any[]) {
    //TODO
  }

  handleDisconnect(client: Socket) {
    //TODO
  }

  @SubscribeMessage(SocketEvents.offer)
  handleOffer(
    @MessageBody() offer: RTCSessionDescriptionInit,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit(SocketEvents.offer, offer);
  }

  @SubscribeMessage(SocketEvents.answer)
  handleAnswer(
    @MessageBody() answer: RTCSessionDescriptionInit,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit(SocketEvents.answer, answer);
  }

  @SubscribeMessage(SocketEvents.iceCandidate)
  handleIceCandidate(
    @MessageBody() candidate: RTCIceCandidateInit,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit(SocketEvents.iceCandidate, candidate);
  }

  @SubscribeMessage(SocketEvents.joinRoom)
  async handleJoinRoom(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    //join or create room with roomId
    //emit get-rooms with new rooms if rooms are changed
    //emit join-room with joining user and current members

    try {
      await client.join(data.roomId);
      if (this.roomsUsersMap.has(data.roomId)) {
        //room exists, adding one user
        this.roomsUsersMap.get(data.roomId)?.add(data.userId);
      } else {
        //new room added
        this.roomsUsersMap.set(data.roomId, new Set([data.userId]));
        this.server.emit(SocketEvents.getRooms, this.getRooms());
      }

      const emission = {
        roomMembers: this.getRoomMembers(data.roomId),
        newMember: data.userId,
        roomId: data.roomId,
      };

      //using "client" instead of "server" avoids emitting to self
      this.server.to(data.roomId).emit(SocketEvents.joinRoom, emission);
    } catch (error) {
      //TODO: error handling
    }
  }

  @SubscribeMessage(SocketEvents.leaveRoom)
  async handleLeaveRoom(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Leaving room ', data.roomId);
    await client.leave(data.roomId);
    this.roomsUsersMap.get(data.roomId)?.delete(data.userId);
    const roomMembers = this.getRoomMembers(data.roomId);
    if (!roomMembers.length) {
      //empty room
      this.roomsUsersMap.delete(data.roomId);
      console.log(
        `Deleted room ${data.roomId}. Does it exist in SocketIO now? ${!!this.server.sockets.adapter.rooms.get(data.roomId)}`,
      );
    } else {
      //some users still in room
      const emission = {
        roomMembers: this.getRoomMembers(data.roomId),
        leavingMember: data.userId,
      };
      this.server.emit(SocketEvents.leaveRoom, emission);
    }
  }

  @SubscribeMessage(SocketEvents.getRooms)
  handleGetRooms(@ConnectedSocket() client: Socket) {
    this.server.emit(SocketEvents.getRooms, this.getRooms());
  }

  private getRoomMembers(roomId: string): string[] {
    return Array.from(this.roomsUsersMap.get(roomId) || []);
  }

  private getRooms(): string[] {
    return Array.from(this.roomsUsersMap.keys());
  }
}
