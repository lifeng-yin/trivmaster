import { useState, useEffect } from 'react'
import { Socket } from 'socket.io-client'

type Message = {
  type: 'regular' | 'system',
  author?: string,
  content: string
}

function ChatBox({ socket }: { socket: Socket}) {

  const [chatMessages, setChatMessages] = useState<Message[]>([])

  useEffect(() => {
    const onChatMessage = (message: Message) => {
      setChatMessages((msgs: Message[]) => [...msgs, message])
    }
    socket.on('chat:message', onChatMessage)
    return () => {
      socket.offAny(onChatMessage)
    }
  }, [socket])

  

  return (<div>
    <h3>Chat</h3>
    { chatMessages
      ? chatMessages.map((message: Message, index) => {
        if (message.type === 'system') {
          return <div key={index}>{message.content}</div>
        }
        else return (<div key={index}>
          <strong>{message.author}</strong>:<span>{message.content}</span>
        </div>)
      })
      : <div>Loading messages...</div>
    }
  </div>)
}

export default ChatBox