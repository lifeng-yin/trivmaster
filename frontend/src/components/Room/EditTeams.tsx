import socket from "../../socket"
import InsertButton from "../ui/InsertButton"

const ChangeTeamButton = ({ currentTeam, newTeam }: {currentTeam: 0 | 1 | 2, newTeam: 1 | 2 }) => {
  if (currentTeam === newTeam) return <></>

  return <InsertButton 
    text={currentTeam === 0 ? 'Join team' : 'Switch team' }
    onClick={() => socket.emit('teams:change', newTeam) }
  />
}

const Teams = ({ currentTeam, team1, team2 }: { currentTeam: 0 | 1 | 2, team1: String[], team2: String[] }) => {
  
  return <>
    <h1 className="text-center text-2xl font-bold">Teams</h1>
    <div className="flex">
      <div className="flex flex-col">
        { team1.map((username, index) => 
          <p key={index}>{username}</p>
        )}
        { <ChangeTeamButton currentTeam={currentTeam} newTeam={1}/>}
      </div>
      <div className="flex flex-col">
        { team2.map((username, index) => 
          <p key={index}>{username}</p>
        )}
        { <ChangeTeamButton currentTeam={currentTeam} newTeam={2}/>}
      </div>
    </div>
  </>
}

export default Teams