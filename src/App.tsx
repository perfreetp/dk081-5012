import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import NavBar from "@/components/NavBar"
import PostPage from "@/pages/PostPage"
import GroupPage from "@/pages/GroupPage"
import RulesPage from "@/pages/RulesPage"
import ProgressPage from "@/pages/ProgressPage"

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Navigate to="/post" replace />} />
          <Route path="/post" element={<PostPage />} />
          <Route path="/group" element={<GroupPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>
        <NavBar />
      </div>
    </Router>
  )
}
