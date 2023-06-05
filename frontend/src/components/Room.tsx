import { useNavigate, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import ChatBox from './Room/ChatBox'
import { ReactElement, useState } from 'react'
import { IconUsers, IconClock, IconEdit, IconRocket } from '@tabler/icons-react'
import EditTeams from './Room/EditTeams'
import EditRound from './Room/EditRound'
import EditQuestions from './Room/EditQuestions'
import ScoreBox from './Room/ScoreBox'
import { UserContextProvider } from '../contexts/UserContext'

type ActivePageType = "playing" | "teams" | "round" | "questions"

const socket = io(import.meta.env.VITE_SERVER_URL)

function Room() {
  const navigate = useNavigate()
  const { roomId } = useParams()

  const [activePage, setActivePage] = useState<ActivePageType>("questions")

  if (!roomId) {
    navigate('/join')
    return <></>
  }
  
  

  function SidebarLink ({ name, icon }: { name: string, icon: ReactElement }) {
    return <div onClick={() => setActivePage(name as ActivePageType)} className="flex">
      { icon }
      <span className="capitalize">{ name }</span>
    </div>
  }

  function Sidebar() {
    return (
      <nav className="absolute hidden">
        <div>
          <h1>Room {roomId}</h1>
        </div>
        <SidebarLink icon={<IconUsers />} name="teams" />
        <SidebarLink icon={<IconClock />} name="round" />
        <SidebarLink icon={<IconEdit />} name="questions" />
      </nav>
    )
  }

  const activePageComponents = {
    "teams": <EditTeams socket={socket} roomId={roomId} />,
    "round": <EditRound socket={socket} roomId={roomId} />,
    "questions": <EditQuestions socket={socket} roomId={roomId} />,
    "playing": <></>
  }



  
  return (
    <UserContextProvider>
      <div className="flex p-4 items-stretch h-screen">
        <Sidebar />
        <main className="w-2/3 h-full relative">
          {activePageComponents[activePage]}
          { activePage !== 'playing' && <button className="absolute bottom-8 right-8 w-32 h-32 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center">
            <IconRocket width="72" height="72" color="#EFEFEF" />
          </button>}
        </main>
        <aside className="w-1/3 h-full">
          <ScoreBox socket={socket} roomId={roomId} />
          <ChatBox socket={socket} roomId={roomId} />
        </aside>
      </div>
    </UserContextProvider>
  )
}

export default Room