import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PatientsScreen from './components/PatientsScreen';
import ChatScreen from './components/ChatScreen';
import MoodAnalysisScreen from './components/MoodAnalysisScreen';
import PatientDetails from './components/PatientDetails';
import NotifsScreen from './components/NotifsScreen';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <ul>
            <li><Link to="/">Patients</Link></li>
            <li><Link to="/notifs">Notifications</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<PatientsScreen/>} />
          <Route path="/chat" element={<ChatScreen/>} />
          <Route path="/notifs" element={<NotifsScreen/>} />
          <Route path="/patients/:name/mood-analysis" element={<MoodAnalysisScreen/>} />
          <Route path="/patients/:name" element={<PatientDetails/>} />
          <Route path="/patients/:name/chat" element={<ChatScreen/>} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
