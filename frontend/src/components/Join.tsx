import { useState, FormEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"

function Join() {
  const location = useLocation()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [roomId, setRoomId] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (username && roomId) navigate(`/room/${roomId}`, {
      state: {
        username,
        roomId
      }
    })
  }

  return (
    <div>
      <h1>Join a room</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="room-id">Room Id</label>
          <input 
            id="room-id"
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
            pattern="[0-9]{4}"
            required
          ></input> 
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            pattern="[A-Za-z\d_]{1,15}"
            required
          ></input> 
        </div>
        
        <button disabled={roomId === ''} type="submit">Join</button>
      </form>

      { location.state && <div>
        <p>{ location.state.error }</p>
      </div>}
    </div>
  )
}

export default Join