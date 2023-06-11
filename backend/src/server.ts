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
    const isAdmin = !(roomId in rooms)

    if (isAdmin) {
      rooms[roomId] = {
        id: roomId,
        members: [username],
        owner: username,
        inProgress: false,
        questions: [],
        team1: [],
        team2: []
      }

      await socket.join(roomId)

      io.in(roomId).emit('chat:message', { 
        roomId,
        author: username,
        type: 'system',
        content: `${username} has created the room.`
      })
    }

    else {
      if (rooms[roomId].members.includes(username)) {
        return socket.emit('error:username-taken')
      }

      rooms[roomId].members.push(username)

      await socket.join(roomId)

      io.in(roomId).emit('chat:message', { 
        roomId,
        author: username,
        type: 'system',
        content: `${username} has joined.`,
      })
    }

    socket.username = username
    socket.roomId = roomId

    socket.emit('update-data', {
      username,
      roomId,
      isAdmin
    }, rooms[socket.roomId].questions, [], [])
  })

  socket.on('chat:message', async message => {
    io.to(socket.roomId).emit('chat:message', message)
  })

  socket.on('questions:add', () => {
    if (rooms[socket.roomId].owner === socket.username) {
      rooms[socket.roomId].questions.push({
        question: '',
        answer: '',
        alternateAnswers: ''
      })
      socket.emit('update-questions', rooms[socket.roomId].questions)
    }
  })

  socket.on('questions:update', (index: number, question: Question) => {
    if (rooms[socket.roomId].owner === socket.username) {
      rooms[socket.roomId].questions[index] = question
      socket.emit('update-questions', rooms[socket.roomId].questions)
    }
  })

  socket.on('questions:delete', (index: number) => {
    if (rooms[socket.roomId].owner === socket.username) {
      rooms[socket.roomId].questions.splice(index, 1)
      socket.emit('update-questions', rooms[socket.roomId].questions)
    }
  })

  socket.on('teams:change', (newTeam: 1 | 2) => {
    rooms[socket.roomId][`team${newTeam}`].push(socket.username)
    if (socket.currentTeam) {
      const index = rooms[socket.roomId][`team${socket.currentTeam}`].findIndex(uname => uname === socket.username)
      rooms[socket.roomId][`team${socket.currentTeam}`].splice(index, 1)
    }
    socket.currentTeam = newTeam
    io.in(socket.roomId).emit(`update-teams`, rooms[socket.roomId].team1, rooms[socket.roomId].team2)
  })

  socket.on('round:start', () => {
    if (rooms[socket.roomId].owner === socket.username) {
      rooms[socket.roomId].inProgress = true
      io.in(socket.roomId).emit('round:start')
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
        io.in(socket.roomId).emit('error:room-deleted')
        io.socketsLeave(socket.roomId)
        delete rooms[socket.roomId]
      }
      else {
        const index = rooms[socket.roomId].members.findIndex(uname => uname === socket.username)
        rooms[socket.roomId].members.splice(index, 1)
      }
    }
  })
})


server.listen(server_port, () => {
  console.log(`🚀 Backend server is up and running on port ${server_port}!`)
})