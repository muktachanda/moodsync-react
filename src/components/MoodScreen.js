import React, { useState } from 'react';
import axios from 'axios';

const MoodScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);

  const moodWords = [
    'Happy',
    'Sad',
    'Angry',
    'Excited',
    'Relaxed',
    'Stressed',
    'Grateful',
    'Hopeful',
    'Confused',
  ];

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
    // Post mood to the backend
    axios.post('http://localhost:5000/api/mood', { user: 'Alice', mood: mood })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error posting mood:', error);
      });
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="mood-screen">
      <h1>Select your mood</h1>
      <div className="mood-grid">
        {moodWords.map((mood, index) => (
          <div
            key={index}
            className="mood-word"
            style={{ backgroundColor: getRandomColor() }}
            onClick={() => handleMoodClick(mood)}
          >
            {mood}
          </div>
        ))}
      </div>
      {selectedMood && (
        <div className="selected-mood">
          You selected: {selectedMood}
        </div>
      )}
    </div>
  );
};

export default MoodScreen;
