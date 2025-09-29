import React, { useState } from "react";
import "../styles/roleSelection.css";

const RoleSelection = ({ setRole, setName }) => {
  const [selected, setSelected] = useState("student");
  const [tempName, setTempName] = useState("");

  const handleContinue = () => {
    if (selected === "student" && !tempName) return alert("Enter name");
    setName(tempName);
    setRole(selected);
  };

  return (
    <div className="role-container">
      <h2>Welcome to the <b>Live Polling System</b></h2>
      <p>Please select the role that best describes you</p>

      <div className="role-options">
        <div
          className={`role-card ${selected === "student" ? "active" : ""}`}
          onClick={() => setSelected("student")}
        >
          <h3>I’m a Student</h3>
          <p>Submit answers and view results in real-time.</p>
          {selected === "student" && (
            <input
              placeholder="Enter your name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />
          )}
        </div>

        <div
          className={`role-card ${selected === "teacher" ? "active" : ""}`}
          onClick={() => setSelected("teacher")}
        >
          <h3>I’m a Teacher</h3>
          <p>Create questions and view live poll results.</p>
        </div>
      </div>

      <button className="btn" onClick={handleContinue}>Continue</button>
    </div>
  );
};

export default RoleSelection;
