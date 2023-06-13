import { useLocation, useNavigate } from 'react-router-dom'
import ChatBox from './Room/ChatBox'
import { ReactElement, useState, useEffect } from 'react'
import { IconUsers, IconClock, IconEdit, IconRocket, IconMenu } from '@tabler/icons-react'
import EditTeams from './Room/EditTeams'
import EditRound from './Room/EditRound'
import EditQuestions from './Room/EditQuestions'
import ScoreBox from './Room/ScoreBox'
import { User, ChatMessage, Question, RoundSettings, Round } from '../types/types'
import socket from '../socket'
import Playing from './Room/Playing'

type ActivePageType = "playing" | "teams" | "round" | "questions"

function Room() {
  const location = useLocation()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [activePage, setActivePage] = useState<ActivePageType>("questions")
  const [sidebarOpened, setSidebarOpened] = useState(false)
  const [user, setUser] = useState<User>({
    id: socket.id,
    username: location.state?.username,
    roomId: location.state?.roomId,
    isAdmin: false
  })
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [team1, setTeam1] = useState<String[]>([])
  const [team2, setTeam2] = useState<String[]>([])
  const [roundSettings, setRoundSettings] = useState<RoundSettings>()
  const [round, setRound] = useState<Round>()
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [currentAnswers, setCurrentAnswers] = useState<string[]>([])
  const [currentCorrectUsername, setCurrentCorrectUsername] = useState('')
  const [isAnswering, setIsAnswering] = useState(true)
  
  useEffect(() => {
    if (!location.state?.username || !location.state?.roomId) {
      navigate('/join')
    }
  })

  useEffect(() => {
    socket.emit('join-room', user)

    socket.on('update-data', (newUser: User, newQuestions: Question[], newTeam1: String[], newTeam2: String[], newRoundSettings: RoundSettings) => {
      setUser(newUser)
      setQuestions(newQuestions)
      setTeam1(newTeam1)
      setTeam2(newTeam2)
      setRoundSettings(newRoundSettings)
      setIsLoading(false)
    })

    socket.on('update-questions', (newQuestions: Question[]) => setQuestions(newQuestions))
    socket.on('update-teams', (newTeam1: String[], newTeam2: String[]) => {
      setTeam1(newTeam1)
      setTeam2(newTeam2)
    })
    socket.on('update-round-settings', (newRoundSettings: RoundSettings) => setRoundSettings(newRoundSettings))

    socket.on('chat:message', (message: ChatMessage) => {
      setChatMessages((msgs: ChatMessage[]) => [...msgs, message])
    })

    socket.on('error:username-taken', () => {
      navigate('/join', { state: { error: 'Error: Username already taken.' }})
    })

    socket.on('error:room-deleted', () => {
      navigate('/join', { state: { error: 'Error: Room unavailable as the owner has left.'}})
    })

    socket.on('round:start', (newRound: Round) => {
      setActivePage('playing')
      setRound(newRound)
    })

    socket.on('round:new-question', (question: string) => {
      setCurrentQuestion(question)
      setIsAnswering(true)
    })

    socket.on('round:answered', (username: string, answers: string[]) => {
      setCurrentCorrectUsername(username)
      setCurrentAnswers(answers)
      setIsAnswering(false)
    })

    socket.on('round:end', () => {
      setRound({ inProgress: false })
    })

    return () => {
      socket.offAny()
    }
  }, [socket])
  
  

  function SidebarLink ({ name, icon }: { name: string, icon: ReactElement }) {
    return <button onClick={() => {
      setActivePage(name as ActivePageType)
      setSidebarOpened(false)
    }} className="flex">
      { icon }
      <span className="capitalize">{ name }</span>
    </button>
  }

  function Sidebar() {
    return (
      <nav className="absolute">
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

  let currentTeam: 0 | 1 | 2 = 0
  if (team1.includes(user.username || '')) currentTeam = 1
  if (team2.includes(user.username || '')) currentTeam = 2

  const activePageComponents = {
    "teams": <EditTeams currentTeam={currentTeam} team1={team1} team2={team2} />,
    "round": <EditRound roundSettings={roundSettings!} />,
    "questions": <EditQuestions questions={questions} />,
    "playing": <Playing round={round!} isAnswering={isAnswering} currentQuestion={currentQuestion} currentAnswers={currentAnswers} currentCorrectUsername={currentCorrectUsername} />
  }


  if (isLoading) return (
    <div>Loading...</div>
  )
  
  return (
    <div className="flex p-4 items-stretch h-screen">
      {sidebarOpened
        ? <Sidebar />
        : <button onClick={() => setSidebarOpened(true)}><IconMenu /></button>
      }
      <main className="w-2/3 h-full relative">
        {activePageComponents[activePage]}
        { activePage !== 'playing' && 
          <button
            className="absolute bottom-8 right-8 w-32 h-32 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition ease duration-200"
            onClick={() => socket.emit('round:start')}
          >
            <IconRocket width="84" height="84" color="#EFEFEF" />
          </button>
        }
      </main>
      <aside className="w-1/3 h-full">
        <ScoreBox />
        <ChatBox chatMessages={chatMessages} />
      </aside>
    </div>
  )
}

export default Room