import React, { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import "../styles/participantList.css";

const ParticipantList = () => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    socket.on("participants", (list) => setParticipants(list));
    return () => socket.off("participants");
  }, []);

  const kickUser = (id) => {
    socket.emit("kick", id);
  };

  return (
    <div className="participants">
      <h4>Participants</h4>
      {participants
        .filter((p) => p.role === "student") // ✅ Only students
        .map((p) => (
          <div key={p.id} className="participant">
            {p.name}
            <button className="btn small danger" onClick={() => kickUser(p.id)}>
              Kick
            </button>
          </div>
        ))}
    </div>
  );
};

export default ParticipantList;
