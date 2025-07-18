//TODO: npm lib to share between front and backend
export enum SocketEvents {
  offer = 'offer',
  answer = 'answer',
  iceCandidate = 'ice-candidate',
  getRooms = 'get-rooms',
  joinRoom = 'join-room',
  leaveRoom = 'leave-room',
  audioVisualizer = 'audio-visualizer',
}
