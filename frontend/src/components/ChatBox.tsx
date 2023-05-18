import { useState, useEffect } from 'react'
import { Socket } from 'socket.io-client'

type Message = {
  type: 'regular' | 'system',
  author?: string,
  content: string
}

function ChatBox({ socket }: { socket: Socket}) {

  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [typedChatMessage, setTypedChatMessage] = useState('')

  useEffect(() => {
    const onChatMessage = (message: Message) => {
      setChatMessages((msgs: Message[]) => [...msgs, message])
    }
    socket.on('chat:message', onChatMessage)
    return () => {
      socket.offAny(onChatMessage)
    }
  }, [socket])

  const handleChatMessageSend = (event: React.FormEvent) => {
    event.preventDefault()
    if (typedChatMessage === '') return
    
    socket.emit('chat:message', {
      type: 'regular',
      content: typedChatMessage
    })
    setTypedChatMessage('')
  } 

  

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
    <form onSubmit={handleChatMessageSend}>
      <input placeholder='Write a message...' value={typedChatMessage} onChange={e => setTypedChatMessage(e.target.value)}></input>
      <button type="submit">Send</button>
    </form>
  </div>)
}

export default ChatBox