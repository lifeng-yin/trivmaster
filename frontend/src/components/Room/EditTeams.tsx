import { Socket } from "socket.io-client"

const Teams = ({ socket, roomId }: { socket: Socket, roomId: string }) => {
  return <>
    <h1 className="text-center text-2xl font-bold">Edit Teams</h1>
  </>
}

export default Teams