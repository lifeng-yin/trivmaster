import { Socket } from "socket.io-client"

const Questions = ({ socket, roomId }: { socket: Socket, roomId: string }) => {
  return <>
    <h1 className="text-center text-2xl font-bold">Edit Questions</h1>
  </>
}

export default Questions