// hooks/useAppData.js
import { useState, useEffect } from 'react';
import { API_URL } from '../App'; // Import the API_URL from App.jsx

export function useAppData() {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch songs
        const songsResponse = await fetch(`${API_URL}/songs`);
        if (!songsResponse.ok) {
          throw new Error('Failed to fetch songs');
        }
        const songsData = await songsResponse.json();
        setSongs(songsData);

        // Fetch playlists
        const playlistsResponse = await fetch(`${API_URL}/playlists`);
        if (!playlistsResponse.ok) {
          throw new Error('Failed to fetch playlists');
        }
        const playlistsData = await playlistsResponse.json();
        setPlaylists(playlistsData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    songs,
    setSongs,
    playlists,
    setPlaylists,
    loading,
    error,
  };
}
