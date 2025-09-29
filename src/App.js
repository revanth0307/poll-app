import React, { useState } from "react";
import RoleSelection from "./components/RoleSelection";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import Kicked from "./components/Kicked";
import "./App.css";

function App() {
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");
  const [kicked, setKicked] = useState(false);

  if (kicked) return <Kicked setRole={setRole} setName={setName} setKicked={setKicked} />;

  if (!role) return <RoleSelection setRole={setRole} setName={setName} />;
  if (role === "teacher") return <TeacherDashboard />;
  if (role === "student") return <StudentDashboard name={name} setKicked={setKicked} />;

  return null;
}

export default App;
