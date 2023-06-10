import { Socket } from 'socket.io'

export interface ISocket extends Socket {
  username?: string,
  roomId: string
}

export interface Room {
  id: string,
  members: String[],
  owner: string,
  inProgress: boolean,
  questions: Question[]
}

export type Question = {
  question: string,
  answer: string,
  alternateAnswers: string
}

export interface User {
  id: string,
  username?: string,
  isAdmin: boolean,
  roomId: string
}