import { useState, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import useLocalStorageState from "use-local-storage-state"

function Join() {
  const navigate = useNavigate()
  const [stage, setStage] = useState(0)
  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useLocalStorageState('username', {
    defaultValue: ''
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStage(s => s + 1)
    if (username) navigate(`/room/${roomId}`)
  }

  return (
    <div>
      <h1>Join a room</h1>
      <form onSubmit={handleSubmit}>
        { stage === 0 && <>
          <label htmlFor="room-id">Room Id</label>
          <input id="room-id" value={roomId} onChange={e => setRoomId(e.target.value)}></input> 
        </>}
        { stage === 1 && <>
          <label htmlFor="username">Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)}></input> 
        </>}
        
        <button disabled={roomId === ''} type="submit">Join</button>
      </form>
    </div>
  )
}

export default Join