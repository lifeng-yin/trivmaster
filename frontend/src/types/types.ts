export interface User {
    id: string,
    username?: string,
    isAdmin: boolean,
    roomId: string
}

export type ChatMessage = {
    type: 'regular' | 'system',
    author?: string,
    content: string
  }

export type Question = {
    question?: string,
    answer?: string,
    alternateAnswers?: string
}

export interface RoundSettings {
    duration: {
        minutes: number,
        seconds: number
    },
    questionDuration: number
}

export interface Round {
    dateFinished?: string,
    inProgress: boolean
}