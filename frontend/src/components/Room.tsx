import { useNavigate, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

function Room() {
  const navigate = useNavigate()
  const { id } = useParams()

  if (!id) {
    navigate('/join')
  }
  
  const socket = io(import.meta.env.VITE_SERVER_URL)
  console.log(socket)
  
  return (
    <div>
      <h1>Room {id}</h1>
    </div>
  )
}

export default Room