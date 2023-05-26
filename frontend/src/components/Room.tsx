import { useNavigate, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import ChatBox from './ChatBox'
import { ReactElement, useState } from 'react'
import { IconUsers, IconClock, IconEdit } from '@tabler/icons-react'
import Teams from './Room/Teams'
import Rounds from './Room/Rounds'
import Questions from './Room/Questions'



const socket = io(import.meta.env.VITE_SERVER_URL)

function Room() {
  const navigate = useNavigate()
  const { roomId } = useParams()

  const [activeComponent, setActiveComponent] = useState<ReactElement>(<Teams />)

  if (!roomId) {
    return navigate('/join')
  }
  
  

  function SidebarLink ({ name, component, icon }: { name: string, component: ReactElement, icon: ReactElement }) {
    return <div onClick={() => setActiveComponent(component)} className="flex">
      { icon }
      <span>{ name }</span>
    </div>
  }

  function Sidebar() {
    return (
      <nav className="basis-48">
        <div>
          <h1>Room {roomId}</h1>
        </div>
        <SidebarLink icon={<IconUsers />} name="Teams" component={<Teams />} />
        <SidebarLink icon={<IconClock />} name="Rounds" component={<Rounds />} />
        <SidebarLink icon={<IconEdit />} name="Questions" component={<Questions />} />
      </nav>
    )
  }
  
  return (
    <div className="flex">
      <Sidebar />
      {activeComponent}
      <ChatBox socket={socket} roomId={roomId} />
    </div>
  )
}

export default Room