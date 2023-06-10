import dotenv from 'dotenv'
import express, { Express } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { ISocket, Question, Room, User } from './types.ts'

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



const rooms: Record<string, Room> = {}

io.on('connection', (socket: ISocket) => {
  socket.on('join-room', async ({ roomId, username }: { roomId: string, username: string } ) => {
    await socket.join(roomId)

    const isAdmin = !(roomId in rooms)

    if (isAdmin) {
      rooms[roomId] = {
        id: roomId,
        members: [socket.id],
        owner: socket.id,
        inProgress: false,
        questions: []
      }

      io.in(roomId).emit('chat:message', { 
        roomId,
        author: username,
        type: 'system',
        content: `${username} has created the room.` 
      })
    }

    else {
      rooms[roomId].members.push(socket.id)

      io.in(roomId).emit('chat:message', { 
        roomId,
        author: username,
        type: 'system',
        content: `${username} has joined.`,
      })
    }

    socket.username = username
    socket.roomId = roomId

    socket.emit('user:update', {
      username,
      roomId,
      isAdmin
    })

    socket.emit('update-questions', rooms[socket.roomId].questions)
  })

  socket.on('chat:message', async message => {
    io.to(socket.roomId).emit('chat:message', message)
  })

  socket.on('questions:add', () => {
    if (rooms[socket.roomId].owner === socket.id) {
      rooms[socket.roomId].questions.push({
        question: '',
        answer: '',
        alternateAnswers: ''
      })
      socket.emit('update-questions', rooms[socket.roomId].questions)
    }
  })

  socket.on('questions:update', (index: number, question: Question) => {
    if (rooms[socket.roomId].owner === socket.id) {
      rooms[socket.roomId].questions[index] = question
      socket.emit('update-questions', rooms[socket.roomId].questions)
    }
  })

  socket.on('questions:delete', (index: number) => {
    if (rooms[socket.roomId].owner === socket.id) {
      rooms[socket.roomId].questions.splice(index, 1)
      socket.emit('update-questions', rooms[socket.roomId].questions)
    }
  })

  socket.on('disconnect', () => {
    io.in(socket.roomId).emit('chat:message', { 
      roomId: socket.roomId,
      author: socket.username,
      type: 'system',
      content: `${socket.username} has left.` 
    })

    if (rooms[socket.roomId]) {
      if (socket.id === rooms[socket.roomId].owner) {
        io.in(socket.roomId).emit('room-deleted')
        io.socketsLeave(socket.roomId)
        delete rooms[socket.roomId]
      }
      else {
        const index = rooms[socket.roomId].members.findIndex(id => id === socket.id)
        rooms[socket.roomId].members.splice(index, 1)
      }
    }

    console.log(rooms)
  })
})


server.listen(server_port, () => {
  console.log(`🚀 Backend server is up and running on port ${server_port}!`)
})