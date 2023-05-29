import { useState, useEffect } from 'react'
import { Socket } from 'socket.io-client'

type Message = {
  type: 'regular' | 'system',
  author?: string,
  content: string
}

function ScoreBox({ socket, roomId }: { socket: Socket, roomId: string }) {
  return (
    <div className="h-1/2 p-4 rounded border-gray-300 border-1 border-solid">
      <h2 className="font-bold">Score</h2>
    </div>
  )
}

export default ScoreBox