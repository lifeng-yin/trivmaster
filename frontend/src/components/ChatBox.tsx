import { useState, useEffect } from 'react'
import { Socket } from 'socket.io-client'

type Message = {
  type: 'regular' | 'system',
  author?: string,
  content: string
}

function ChatBox({ socket, roomId }: { socket: Socket, roomId: string }) {

  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [typedChatMessage, setTypedChatMessage] = useState('')

  useEffect(() => {
    socket.emit('join-room', { roomId })
    const onChatMessage = (message: Message) => {
      setChatMessages((msgs: Message[]) => [...msgs, message])
    }
    socket.on('chat:message', onChatMessage)
    return () => {
      socket.offAny(onChatMessage)
    }
  }, [socket, roomId])

  const handleChatMessageSend = (event: React.FormEvent) => {
    event.preventDefault()
    if (typedChatMessage === '') return
    
    socket.emit('chat:message', {
      type: 'regular',
      content: typedChatMessage
    })
    setTypedChatMessage('')
  } 

  

  return (
    <div className="absolute bottom-4 right-4 w-80 h-96 p-4 rounded border-gray-300 border-1 border-solid">
      <h2 className="font-bold">Chat</h2>
      <div className="overflow-auto h-[18rem]">
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
      </div>
      <form onSubmit={handleChatMessageSend} className="mt-2 flex justify-between gap-2">
        <input 
          placeholder='Write a message...'
          value={typedChatMessage}
          onChange={e => setTypedChatMessage(e.target.value)}
          className="bg-gray-100 pl-2 rounded-md"
        ></input>
        <button
          type="submit"
          className="text-white bg-blue-600 px-4 py-1 rounded-md"
        >Send</button>
      </form>
    </div>
  )
}

export default ChatBox