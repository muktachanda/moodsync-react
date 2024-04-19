import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import MoodScreen from './components/MoodScreen';
import ChatScreen from './components/ChatScreen';
import SpotifyScreen from './components/SpotifyScreen';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <ul>
            <li><Link to="/">Moodword</Link></li>
            <li><Link to="/chat">Chat</Link></li>
            <li><Link to="/spotify">Spotify</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<MoodScreen/>} />
          <Route path="/chat" element={<ChatScreen/>} />
          <Route path="/spotify" element={<SpotifyScreen/>} />
          <Route path='/spotify/callback' element={<SpotifyScreen/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
