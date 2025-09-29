import React from "react";
import "../styles/kicked.css";


const Kicked = ({ setRole, setName, setKicked }) => {
  const goHome = () => {
    setRole(null);     // back to role selection
    setName("");       // clear old name
    setKicked(false);  // exit kicked state ✅
  };

  return (
    <div className="kicked-container">
      <h2>You’ve been Kicked out !</h2>
      <p>Looks like the teacher has removed you from the poll system. Please try again sometime.</p>
      <button className="btn primary" onClick={goHome}>Go Home</button>
    </div>
  );
};

export default Kicked;
