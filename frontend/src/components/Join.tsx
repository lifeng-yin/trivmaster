import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Join() {
  const navigate = useNavigate()
  const [roomId, setRoomId] = useState('')

  const handleSubmit = () => {
    navigate(`/room/${roomId}`)
  }

  return (
    <div>
      <h1>Join a room</h1>
      <form onSubmit={handleSubmit}>
        <input value={roomId} onChange={e => setRoomId(e.target.value)}></input>
        <button disabled={roomId === ''} type="submit">Join</button>
      </form>
    </div>
  )
}

export default Join