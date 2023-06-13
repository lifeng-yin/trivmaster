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
  questions: Question[],
  team1: String[],
  team2: String[],
  settings: RoundSettings,
  currentRound?: Round
}

export type Question = {
  question: string,
  answer: string
}

export interface User {
  id: string,
  username?: string,
  isAdmin: boolean,
  roomId: string
}

export type RoundSettings = {
  duration: {
      minutes: number,
      seconds: number
  },
  questionDuration: number
}

export type Round = {
  dateFinished: Date
  inProgress: boolean,
  team1Score: number,
  team2Score: number,
  currentQuestion?: Question,
  currentBuzzed?: string,
  currentAnswered: boolean
}