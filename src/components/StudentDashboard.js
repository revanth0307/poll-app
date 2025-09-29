import React, { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import PollResults from "./PollResults";
import ChatBox from "./ChatBox";
import "../styles/studentDashboard.css";

const StudentDashboard = ({ name, setKicked }) => {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    socket.emit("join", name);

    socket.on("newPoll", (poll) => {
      setQuestion(poll);
      setResults(null);
      setAnswer("");
      setSubmitted(false);
      if (poll.duration) setTimeLeft(poll.duration);
    });

    socket.on("results", (data) => setResults(data));

    socket.on("finalResults", (final) => {
      setResults(final);
      setQuestion(null);
      setSubmitted(false);
      setTimeLeft(null);
    });

    socket.on("kicked", () => {
      setKicked(true);
    });

    return () => {
      socket.off("newPoll");
      socket.off("results");
      socket.off("finalResults");
      socket.off("kicked");
    };
  }, [name, setKicked]);

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

  const submitAnswer = () => {
    if (!answer) return alert("Please select an option");
    socket.emit("submitAnswer", { option: answer });
    setSubmitted(true);
  };

  if (!question) {
    return <h3>Wait for the teacher to ask questions...</h3>;
  }

  return (
    <div className="student-container">
      <h2>
        Question {timeLeft !== null && (
          <span style={{ color: "red", marginLeft: "10px" }}>
            ⏱ {`00:${timeLeft < 10 ? "0" + timeLeft : timeLeft}`}
          </span>
        )}
      </h2>
      <p>{question.question}</p>

      {!submitted ? (
        <>
          <div className="options">
            {question.options.map((opt, i) => (
              <div
                key={i}
                className={`option ${answer === opt ? "selected" : ""}`}
                onClick={() => setAnswer(opt)}
              >
                {opt}
              </div>
            ))}
          </div>
          <button className="btn primary" onClick={submitAnswer}>
            Submit
          </button>
        </>
      ) : (
        <PollResults results={results} />
      )}

      <ChatBox name={name} />
    </div>
  );
};

export default StudentDashboard;
