import React, { useState, useEffect } from 'react';

const SpotifyScreen = () => {
  // Sample data for demonstration
  const dummyData = [
    {
      track: {
        name: "Somebody That I Used To Know",
        artists: [{ name: "Gotye" }, { name: "Kimbra" }],
        album: {
          images: [{ url: "https://i.scdn.co/image/ab67616d0000b273d840e1af736fb19b98675a88" }]
        },
        valence: 0.72,
        energy: 0.86
      }
    },
    {
      track: {
        name: "Shape of You",
        artists: [{ name: "Ed Sheeran" }],
        album: {
          images: [{ url: "https://i.scdn.co/image/ab67616d0000b273dbb0741c3c56c0eb0b5351f5" }]
        },
        valence: 0.93,
        energy: 0.65
      }
    },
    {
      track: {
        name: "Dandelions",
        artists: [{ name: "Ruth B" }],
        album: {
          images: [{ url: "https://i.scdn.co/image/ab67616d0000b273dbb0741c3c56c0eb0b5351f5" }]
        },
        valence: 0.56,
        energy: 0.34
      }
    },
    {
      track: {
        name: "Lovely",
        artists: [{ name: "Billie Eilish" }],
        album: {
          images: [{ url: "https://i.scdn.co/image/ab67616d0000b273dbb0741c3c56c0eb0b5351f5" }]
        },
        valence: 0.34,
        energy: 0.57
      }
    }

  ];

  const [userSongs, setUserSongs] = useState(null);

  useEffect(() => {
    // Set dummy data when component mounts
    setUserSongs(dummyData);
  }, []);

  return (
    <div className="spotify-screen">
      <h2>Recently Played Songs</h2>
      <div className="recent-songs">
        {userSongs ? (
          userSongs.map((song, index) => (
            <div key={index} className="song">
              <div>
                <h3>{song.track.name}</h3>
                <p>{song.track.artists.map((artist) => artist.name).join(', ')}</p>
                <p>Valence: {song.track.valence}, Energy: {song.track.energy}</p>
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
