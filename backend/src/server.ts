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
  socket.on('join-room', ({ id, username }: { id: string, username: string } ) => {
    socket.join(id)

    io.in(id).emit('chat:message', {
      type: 'system',
      author: undefined,
      content: `${username} has joined.`
    })
  })
})


server.listen(server_port, () => {
  console.log(`🚀 Backend server is up and running on port ${server_port}!`)
})