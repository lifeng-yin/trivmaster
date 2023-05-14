import express, { Express } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app: Express = express()
const server = createServer(app)
const io = new Server(server)

server.listen(5000, () => {
  console.log('🚀 Backend server is up and running!')
})