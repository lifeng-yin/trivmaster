import { Socket } from 'socket.io'

export interface ISocket extends Socket {
  username?: string,
  roomId: string,
  currentTeam?: 1 | 2
}

export interface Room {
  id: string,
  members: String[],
  owner: string,
  inProgress: boolean,
  questions: Question[],
  team1: String[],
  team2: String[]
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