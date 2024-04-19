import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MoodAnalysisScreen = () => {
  const { name } = useParams();
  const [moodHistory, setMoodHistory] = useState([]);
  const [spotifyMood, setSpotifyMood] = useState({
    Happy: 0,
    Sad: 0,
    Angry: 0,
    Excited: 0,
    Relaxed: 0,
    Stressed: 0,
    Grateful: 0,
    Hopeful: 0,
    Confused: 0
  });
  
  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/mood_history?user=${name}`);
        setMoodHistory(response.data[0]?.mood_history || []);
      } catch (error) {
        console.error('Error fetching mood history:', error);
      }
    };

    fetchMoodHistory();

    // Calculate Spotify mood scores only once after the initial render
    calculateSpotifyMood();
  }, [name]);

  const spotifyMoodData = {
    song1: ['Happy', 'Excited', 'Hopeful'],
    song2: ['Sad', 'Relaxed'],
    song3: ['Angry', 'Stressed'],
    song4: ['Happy', 'Grateful'],
    song5: ['Sad', 'Confused']
  };

  // Calculate Spotify mood scores
  const calculateSpotifyMood = () => {
    const moodScores = {
      Happy: 0,
      Sad: 0,
      Angry: 0,
      Excited: 0,
      Relaxed: 0,
      Stressed: 0,
      Grateful: 0,
      Hopeful: 0,
      Confused: 0
    };

    // Iterate through each song and update mood scores
    Object.values(spotifyMoodData).forEach(songMoods => {
      songMoods.forEach(mood => {
        moodScores[mood]++;
      });
    });

    setSpotifyMood(moodScores);
  };

  return (
    <div className="screen">
      <h2>Mood History for {name}</h2>
      <div className="mood-history">
        {moodHistory.map((entry, index) => (
          <div key={index} className="mood-entry">
            <p>Date: {entry.date}</p>
            <p>Mood: {entry.mood}</p>
          </div>
        ))}
      </div>
      <h2>Spotify Mood</h2>
      <div className="spotify-mood">
        {Object.entries(spotifyMood).map(([mood, score]) => (
          <p key={mood}>{mood}: {score}</p>
        ))}
      </div>
    </div>
  );
}

export default MoodAnalysisScreen;
