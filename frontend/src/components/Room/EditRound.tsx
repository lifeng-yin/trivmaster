import { Socket } from "socket.io-client"

const Round = ({ socket, roomId }: { socket: Socket, roomId: string }) => {
  return <>
    <h1 className="text-center text-2xl font-bold">Edit Round</h1>
  </>
}

export default Round