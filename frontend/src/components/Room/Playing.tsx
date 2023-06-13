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

const Playing = ({ round, isAnswering, currentQuestion, currentAnswers, currentCorrectUsername }: { round: Round, isAnswering: boolean, currentQuestion: string, currentAnswers: string[], currentCorrectUsername: string }) => {
  const [typedAnswer, setTypedAnswer] = useState('')

  return <>
    <h1>Game In Progress</h1>
    <Countdown round={round} />
    <h1>{currentQuestion}</h1>
    { isAnswering
      ? <div>
        <input
          value={typedAnswer}
          onChange={e => setTypedAnswer(e.target.value)}
          placeholder="Your answer here..."
        />
      </div>
      : <div>
        <h1>{currentCorrectUsername || 'No one'} answered it correctly!</h1>
        { currentAnswers.length === 1
          ? <p>The answer was {currentAnswers[0]}</p>
          : <p>The possible answers were: {currentAnswers.join(', ')}</p>
        }
      </div>
    }
  </>
}

export default Playing