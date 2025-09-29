import React, { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import "../styles/chatBox.css";

const ChatBox = ({ name }) => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    socket.on("chat", (data) => setMessages((prev) => [...prev, data]));
    return () => socket.off("chat");
  }, []);

  const sendMessage = () => {
    if (!msg) return;
    socket.emit("chat", { user: name || "Teacher", text: msg });
    setMsg("");
  };

  return (
    <div className="chatbox">
      <h4>Chat</h4>
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className="message">
            <b>{m.user}: </b>{m.text}
          </div>
        ))}
      </div>
      <input
        placeholder="Type message..."
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button className="btn" onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
