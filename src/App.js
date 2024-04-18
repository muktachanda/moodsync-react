import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PatientsScreen from './components/PatientsScreen';
import ChatScreen from './components/ChatScreen';
import MoodAnalysisScreen from './components/MoodAnalysisScreen';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <ul>
            <li><Link to="/patients">Patients</Link></li>
            <li><Link to="/chat">Chat</Link></li>
            <li><Link to="/mood-analysis">Mood Analysis</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/patients" component={PatientsScreen} />
          <Route path="/chat" component={ChatScreen} />
          <Route path="/mood-analysis" component={MoodAnalysisScreen} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
