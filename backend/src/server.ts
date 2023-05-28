import dotenv from 'dotenv'
import express, { Express } from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { ISocket } from './types.ts'

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

io.on('connection', (socket: ISocket) => {
  socket.on('join-room', async ({ roomId, author: username }: { roomId: string, author: string } ) => {
    await socket.join(roomId)

    io.in(roomId).emit('chat:message', { 
      roomId,
      author: username,
      type: 'system',
      content: `${username} has joined.` 
    })

    socket.username = username
    socket.roomId = roomId
  })

  socket.on('chat:message', async message => {
    io.to(socket.roomId).emit('chat:message', message)
  })

  socket.on('disconnect', () => {
    io.in(socket.roomId).emit('chat:message', { 
      roomId: socket.roomId,
      author: socket.username,
      type: 'system',
      content: `${socket.username} has left.` 
    })
  })
})


server.listen(server_port, () => {
  console.log(`🚀 Backend server is up and running on port ${server_port}!`)
})