import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EVotingInterface from './Components/Home'
import VotingDashboard from './Components/Voting'
import AdminDashboard from './Components/Admin'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EVotingInterface/>} />
        <Route path="/dashboard" element={<VotingDashboard/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
        
      </Routes>
    </Router>
  )
}

export default App