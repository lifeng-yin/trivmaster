import { useNavigate, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import ChatBox from './ChatBox'

const socket = io(import.meta.env.VITE_SERVER_URL)

function Room() {
  const navigate = useNavigate()
  const { roomId } = useParams()

  if (!roomId) {
    navigate('/join')
  }
  
  socket.emit('join-room', { roomId })

  
  
  return (
    <main>
      <div>
        <h1>Room {roomId}</h1>
        <ChatBox socket={socket}/>
      </div>
      
    </main>
    
  )
}

export default Room