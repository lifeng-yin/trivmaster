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
    />
    <label htmlFor="duration-seconds">Seconds</label>
    <input
      id="duration-seconds"
      value={roundSettings.duration.seconds}
      onChange={e => socket.emit('round-settings:update', { ...roundSettings, duration: { minutes: roundSettings.duration.minutes, seconds: e.target.value }})}
      type="number"
      min={0}
    />
  </>
}

export default EditRound