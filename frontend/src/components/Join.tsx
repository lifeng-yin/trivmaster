import { useState, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Join() {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username && roomId)
      navigate(`/room/${roomId}`, {
        state: {
          username,
          roomId,
        },
      });
  };

  return (
    <div>
      <h1 className="pl-4 text-2xl font-bold mt-8">Join a room</h1>
      <form onSubmit={handleSubmit} className="pl-4">
        <div className="flex flex-col mt-8">
          <label htmlFor="room-id" className="font-bold text-lg">
            Room Id
          </label>
          <input
            id="room-id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            pattern="[0-9]{4}"
            required
            className="p-2 bg-gray-100"
          ></input>
        </div>
        <div className="flex flex-col mt-8">
          <label htmlFor="username" className="font-bold text-lg">
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            pattern="[A-Za-z\d_]{1,15}"
            className="p-2 bg-gray-100"
            required
          ></input>
        </div>

        <button
          disabled={roomId === ""}
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mt-8"
        >
          Join
        </button>
      </form>

      {location.state && (
        <div>
          <p>{location.state.error}</p>
        </div>
      )}
    </div>
  );
}

export default Join;
