import { useEffect, useState } from 'react'
import socket from '../../socket'
import { Round } from '../../types/types'

const Countdown = ({ round }: { round: Round }) => {
  if (!round.dateFinished || !round.inProgress) {
    return <div><p>0:00</p></div>
  }

  const [durationUntilFinished, setDurationUntilFinished] = useState(new Date(+Date.parse(round.dateFinished) - Date.now()))

  useEffect(() => {
    const interval = setInterval(() => {
      setDurationUntilFinished(new Date(+Date.parse(round.dateFinished!) - Date.now()))
    }, 1000)
  
    return () => {
      clearInterval(interval)
    }
  }, [])

  const padZeroes = (n: number) => n > 9 ? n.toString() : "0" + n
  
  return <div>
      <p>{durationUntilFinished.getMinutes()}:{padZeroes(durationUntilFinished.getSeconds())}</p>
  </div>
}

const Playing = ({ round }: { round: Round }) => {
  return <>
    <h1>Game In Progress</h1>
    <Countdown round={round} />
  </>
}

export default Playing