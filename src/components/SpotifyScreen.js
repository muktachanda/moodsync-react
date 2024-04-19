import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SpotifyScreen = () => {
  const [userSongs, setUserSongs] = useState(null);

  useEffect(() => {
    const fetchSpotifyAuthorizationUrl = async () => {
      try {
        // Fetch Spotify authorization URL from the backend
        const response = await axios.get('http://localhost:5000/api/spotify/authorize');
        const authorizationUrl = response.data.authorization_url;
        
        // Redirect the user to the Spotify authorization URL
        window.location.href = authorizationUrl;
      } catch (error) {
        console.error('Error fetching Spotify authorization URL:', error);
      }
    };

    fetchSpotifyAuthorizationUrl();
  }, []);

  useEffect(() => {
    // Function to fetch recent songs after authorization
    const fetchRecentSongs = async () => {
      try {
        // Fetch recent songs from the backend
        const response = await axios.get('http://localhost:5000/api/spotify/recent-songs');
        setUserSongs(response.data);
      } catch (error) {
        console.error('Error fetching recent songs:', error);
      }
    };

    fetchRecentSongs();
  }, []);

  return (
    <div className="spotify-screen">
      <h1>Spotify User Data</h1>
      <h2>Recently Played Songs</h2>
      <div className="recent-songs">
        {userSongs ? (
          userSongs.map((song, index) => (
            <div key={index} className="song">
              <img src={song.track.album.images[0].url} alt={song.track.name} />
              <div>
                <h3>{song.track.name}</h3>
                <p>{song.track.artists.map((artist) => artist.name).join(', ')}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default SpotifyScreen;
