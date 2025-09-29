import React, { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import PollResults from "./PollResults";
import ChatBox from "./ChatBox";
import ParticipantList from "./ParticipantList";
import "../styles/teacherDashboard.css";

const TeacherDashboard = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState(15); // default timer
  const [currentPoll, setCurrentPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    socket.emit("join", "Teacher");

    socket.on("newPoll", (poll) => {
      setCurrentPoll(poll);
      setResults(null);
      if (poll.duration) setTimeLeft(poll.duration);
    });

    socket.on("results", (data) => setResults(data));

    socket.on("finalResults", (final) => {
      setResults(final);
      setCurrentPoll(null);
      setTimeLeft(null);
    });

    return () => {
      socket.off("newPoll");
      socket.off("results");
      socket.off("finalResults");
    };
  }, []);

  // countdown
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      setTimeLeft(null);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const askQuestion = () => {
    if (!question || options.some(opt => !opt)) {
      alert("Please enter a question and all options");
      return;
    }
    const poll = { question, options, duration };
    socket.emit("createPoll", poll);
    setQuestion("");
    setOptions(["", ""]);
    setDuration(15);
  };

  return (
    <div className="teacher-container">
      <h2>Let’s Get Started</h2>

      {!currentPoll ? (
        <>
          <p>Enter your question and options to create a poll</p>
          <input
            type="text"
            placeholder="Enter question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {options.map((opt, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(i, e.target.value)}
            />
          ))}

          <div className="duration-field">
  <label>Poll Duration (seconds)</label>
  <input
    type="number"
    min="5"
    max="300"
    value={duration}
    onChange={(e) => setDuration(Number(e.target.value))}
  />
</div>

          <button className="btn secondary" onClick={addOption}>+ Add Option</button>
          <button className="btn primary" onClick={askQuestion}>Ask Question</button>
        </>
      ) : (
        <>
          <h3>
            Question {timeLeft !== null && (
              <span style={{ color: "red", marginLeft: "10px" }}>
                ⏱ {`00:${timeLeft < 10 ? "0" + timeLeft : timeLeft}`}
              </span>
            )}
          </h3>
          <p>{currentPoll.question}</p>
          <PollResults results={results} />
          <div className="teacher-extras">
            <ChatBox name="Teacher" />
            <ParticipantList />
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;
