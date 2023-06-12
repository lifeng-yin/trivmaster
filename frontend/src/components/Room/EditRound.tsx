import socket from "../../socket"
import { RoundSettings } from "../../types/types"

const EditRound = ({ roundSettings }: { roundSettings: RoundSettings }) => {
  return <>
    <h1 className="text-center text-2xl font-bold">Edit Round Settings</h1>
    <p>Round Duration</p>
    <label htmlFor="duration-minutes">Minutes</label>
    <input
      id="duration-minutes"
      type="number"
      value={roundSettings.duration.minutes}
      onChange={e => socket.emit('round-settings:update', { ...roundSettings, duration: { minutes: e.target.value, seconds: roundSettings.duration.seconds }})}
      min={0}
      max={99}
      step={1}
    />
    <label htmlFor="duration-seconds">Seconds</label>
    <input
      id="duration-seconds"
      value={roundSettings.duration.seconds}
      onChange={e => socket.emit('round-settings:update', { ...roundSettings, duration: { minutes: roundSettings.duration.minutes, seconds: e.target.value }})}
      type="number"
      min={0}
      max={55}
      step={5}
    />
    <label htmlFor="duration-seconds">Question Duration (seconds)</label>
    <input
      id="question-duration"
      value={roundSettings.questionDuration}
      onChange={e => socket.emit('round-settings:update', { ...roundSettings, questionDuration: e.target.value })}
      type="number"
      min={2}
      max={99}
      step={1}
    />
  </>
}

export default EditRound