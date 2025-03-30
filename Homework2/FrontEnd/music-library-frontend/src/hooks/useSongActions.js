// hooks/useSongActions.js
import { useState } from 'react';
import { API_URL } from '../App'; // Import the API_URL from App.jsx

export function useSongActions({
  songs,
  setSongs,
  setSelectedSongDetails,
  setActiveTab,
}) {
  const [selectedSongId, setSelectedSongId] = useState(null);

  // Create a new song
  const handleAddSong = async (songData) => {
    try {
      const response = await fetch(`${API_URL}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(songData),
      });

      if (!response.ok) {
        throw new Error('Failed to add song');
      }

      const newSong = await response.json();
      setSongs([...songs, newSong]);

      // Also fetch and save metadata for this song
      await fetch(`${API_URL}/metadata/${newSong._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return newSong;
    } catch (err) {
      console.error('Error adding song:', err);
      throw err;
    }
  };

  // Update a song
  const handleUpdateSong = async (songId, songData) => {
    try {
      const response = await fetch(`${API_URL}/songs/${songId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(songData),
      });

      if (!response.ok) {
        throw new Error('Failed to update song');
      }

      const updatedSong = await response.json();
      setSongs(songs.map((song) => (song._id === songId ? updatedSong : song)));
      return updatedSong;
    } catch (err) {
      console.error('Error updating song:', err);
      throw err;
    }
  };

  // Delete a song
  const handleDeleteSong = async (songId) => {
    try {
      const response = await fetch(`${API_URL}/songs/${songId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete song');
      }

      setSongs(songs.filter((song) => song._id !== songId));

      // Also try to delete metadata
      try {
        await fetch(`${API_URL}/metadata/${songId}`, {
          method: 'DELETE',
        });
      } catch (metadataErr) {
        console.warn('Could not delete metadata:', metadataErr);
      }

      // If this was the selected song, clear it
      if (selectedSongId === songId) {
        setSelectedSongId(null);
        setSelectedSongDetails(null);
      }
    } catch (err) {
      console.error('Error deleting song:', err);
      throw err;
    }
  };

  // View song details with metadata and lyrics
  const handleViewSongDetails = async (songId) => {
    setSelectedSongId(songId);

    try {
      // Get song data
      const songResponse = await fetch(`${API_URL}/songs/${songId}`);
      if (!songResponse.ok) {
        throw new Error('Failed to fetch song details');
      }
      const songData = await songResponse.json();

      // Get metadata
      const metadataResponse = await fetch(`${API_URL}/metadata/${songId}`);
      let metadata = null;
      if (metadataResponse.ok) {
        metadata = await metadataResponse.json();
      }

      // Get lyrics
      const lyricsResponse = await fetch(`${API_URL}/lyrics/${songId}`);
      let lyrics = null;
      if (lyricsResponse.ok) {
        lyrics = await lyricsResponse.json();
      }

      // Combine all data
      const songDetails = {
        ...songData,
        metadata: metadata,
        lyrics: lyrics?.lyrics || null,
      };

      setSelectedSongDetails(songDetails);
      setActiveTab('songDetails');
      return songDetails;
    } catch (err) {
      console.error('Error fetching song details:', err);
      throw err;
    }
  };

  return {
    handleAddSong,
    handleUpdateSong,
    handleDeleteSong,
    handleViewSongDetails,
    selectedSongId,
  };
}
