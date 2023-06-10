import { useState, useEffect, useRef } from 'react'
import socket from '../../socket'
import { ChatMessage } from '../../types/types'

function ChatBox({ chatMessages }: { chatMessages: ChatMessage[] }) {

  const [typedChatMessage, setTypedChatMessage] = useState('')

  const messagesContainer = useRef<HTMLDivElement>(null)

  const handleChatMessageSend = (event: React.FormEvent) => {
    event.preventDefault()
    if (typedChatMessage === '') return
    
    socket.emit('chat:message', {
      type: 'regular',
      content: typedChatMessage
    })

    setTypedChatMessage('')
  }

  useEffect(() => {
    const { offsetHeight, scrollHeight, scrollTop } = messagesContainer?.current as HTMLDivElement
    if (scrollHeight <= scrollTop + offsetHeight + 100) {
      messagesContainer.current?.scrollTo(0, scrollHeight)
    }
  })


  return (
    <div className="h-1/2 p-4 rounded border-gray-300 border-1 border-solid flex flex-col">
      <h2 className="font-bold">Chat</h2>
      <div ref={messagesContainer} className="overflow-scroll flex-1 [overflow-anchor:none]">
        { chatMessages
          ? chatMessages.map((message: ChatMessage, index) => {
            if (message.type === 'system') {
              return <div key={index} className="h-4 my-1 [overflow-anchor:auto]">{message.content}</div>
            }
            else return (<div key={index} className="h-4 my-1 [overflow-anchor:auto]">
              <strong>{message.author}</strong>:<span>{message.content}</span>
            </div>)
          })
          : <div>Loading messages...</div>
        }
      </div>
      <form onSubmit={handleChatMessageSend} className="flex-none flex justify-between gap-2">
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