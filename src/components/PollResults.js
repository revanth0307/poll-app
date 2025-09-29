import React from "react";
import "../styles/pollResults.css";
const PollResults = ({ results }) => {
  if (!results) return null;
  const total = Object.values(results).reduce((a, b) => a + b, 0);

  return (
    <div className="results-container">
      <h3>Live Poll Results</h3>
      {Object.entries(results).map(([option, count], i) => {
        const percent = total ? Math.round((count / total) * 100) : 0;
        return (
          <div key={i} className="result-bar">
            <span>{option}</span>
            <div className="bar">
              <div className="fill" style={{ width: `${percent}%` }}>
                {percent}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PollResults;
