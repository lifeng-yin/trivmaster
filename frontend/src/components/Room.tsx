import { useNavigate, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import ChatBox from './Room/ChatBox'
import { ReactElement, useState } from 'react'
import { IconUsers, IconClock, IconEdit } from '@tabler/icons-react'
import Teams from './Room/Teams'
import Rounds from './Room/Rounds'
import Questions from './Room/Questions'
import ScoreBox from './Room/ScoreBox'



const socket = io(import.meta.env.VITE_SERVER_URL)

function Room() {
  const navigate = useNavigate()
  const { roomId } = useParams()

  const [activeComponent, setActiveComponent] = useState<ReactElement>(<Teams />)

  if (!roomId) {
    navigate('/join')
    return <></>
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
    <div className="flex p-4 items-stretch h-screen">
      {/* <Sidebar /> */}
      <main className="w-2/3 h-full">
        {activeComponent}
      </main>
      <aside className="w-1/3 h-full">
        <ScoreBox socket={socket} roomId={roomId} />
        <ChatBox socket={socket} roomId={roomId} />
      </aside>
      
    </div>
  )
}

export default Room