import dotenv from 'dotenv'
import express, { Express } from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

dotenv.config()

const client_port = process.env.CLIENT_PORT || 5173
const server_port = process.env.SERVER_PORT || 5000

const app: Express = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:' + client_port
  }
})

io.on('connection', (socket: Socket) => {
  socket.on('join-room', ({ roomId, author }: { roomId: string, author: string } ) => {
    socket.join(roomId)

    io.in(roomId).emit('chat:message', { 
      roomId,
      author,
      type: 'system',
      content: `${author} has joined.` 
    })
  })

  socket.on('chat:message', message => {
    for (const roomId of socket.rooms) {
      if (roomId) io.in(roomId).emit('chat:message', message)
    }
  })
})


server.listen(server_port, () => {
  console.log(`🚀 Backend server is up and running on port ${server_port}!`)
})