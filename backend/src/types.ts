import { Socket } from 'socket.io'

interface ISocket extends Socket {
  username?: string,
  roomId: string
}

export { ISocket }