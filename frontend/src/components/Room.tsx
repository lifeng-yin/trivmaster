import { useLocation, useNavigate } from 'react-router-dom'
import ChatBox from './Room/ChatBox'
import { ReactElement, useState, useEffect } from 'react'
import { IconUsers, IconClock, IconEdit, IconRocket } from '@tabler/icons-react'
import EditTeams from './Room/EditTeams'
import EditRound from './Room/EditRound'
import EditQuestions from './Room/EditQuestions'
import ScoreBox from './Room/ScoreBox'
import { User, ChatMessage, Question } from '../types/types'
import socket from '../socket'

type ActivePageType = "playing" | "teams" | "round" | "questions"

function Room() {
  const location = useLocation()
  const navigate = useNavigate()

  if (!location.state.username || !location.state.roomId) {
    navigate('/join')
    return <></>
  }

  const [activePage, setActivePage] = useState<ActivePageType>("questions")
  const [user, setUser] = useState<User>({
    id: socket.id,
    username: location.state.username,
    roomId: location.state.roomId,
    isAdmin: false
  })
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  

  useEffect(() => {
    socket.emit('join-room', user)

    socket.on('user:update', (newUser: User) => {
      setUser(newUser)
    })

    socket.on('chat:message', (message: ChatMessage) => {
      setChatMessages((msgs: ChatMessage[]) => [...msgs, message])
    })

    socket.on('update-questions', questions => setQuestions(questions))

    return () => {
      socket.offAny()
    }
  }, [socket])
  
  

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
          <h1>Room {user?.roomId}</h1>
          <p>Playing as {user?.username}</p>
        </div>
        <SidebarLink icon={<IconUsers />} name="teams" />
        <SidebarLink icon={<IconClock />} name="round" />
        <SidebarLink icon={<IconEdit />} name="questions" />
      </nav>
    )
  }

  const activePageComponents = {
    "teams": <></>,
    "round": <></>,
    "questions": <EditQuestions questions={questions} />,
    "playing": <></>
  }



  
  return (
    <div className="flex p-4 items-stretch h-screen">
      <Sidebar />
      <main className="w-2/3 h-full relative">
        {activePageComponents[activePage]}
        { activePage !== 'playing' && <button className="absolute bottom-8 right-8 w-32 h-32 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition ease duration-200">
          <IconRocket width="84" height="84" color="#EFEFEF" />
        </button>}
      </main>
      <aside className="w-1/3 h-full">
        <ScoreBox />
        <ChatBox chatMessages={chatMessages} />
      </aside>
    </div>
  )
}

export default Room