// hooks/usePlaylistActions.js

// API base URL
const API_URL = 'http://localhost:6000/api';

export function usePlaylistActions({
  playlists,
  setPlaylists,
  setSelectedPlaylist,
  selectedPlaylist,
  setActiveTab,
}) {
  // Create a new playlist
  const handleAddPlaylist = async (playlistData) => {
    try {
      const response = await fetch(`${API_URL}/playlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlistData),
      });

      if (!response.ok) {
        throw new Error('Failed to add playlist');
      }

      const newPlaylist = await response.json();
      setPlaylists([...playlists, newPlaylist]);
      return newPlaylist;
    } catch (err) {
      console.error('Error adding playlist:', err);
      throw err;
    }
  };

  // Update a playlist
  const handleUpdatePlaylist = async (playlistId, playlistData) => {
    try {
      const response = await fetch(`${API_URL}/playlists/${playlistId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlistData),
      });

      if (!response.ok) {
        throw new Error('Failed to update playlist');
      }

      const updatedPlaylist = await response.json();
      setPlaylists(
        playlists.map((playlist) =>
          playlist._id === playlistId ? updatedPlaylist : playlist
        )
      );

      // If this was the selected playlist, update it
      if (selectedPlaylist && selectedPlaylist._id === playlistId) {
        setSelectedPlaylist(updatedPlaylist);
      }

      return updatedPlaylist;
    } catch (err) {
      console.error('Error updating playlist:', err);
      throw err;
    }
  };

  // Delete a playlist
  const handleDeletePlaylist = async (playlistId) => {
    try {
      const response = await fetch(`${API_URL}/playlists/${playlistId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete playlist');
      }

      setPlaylists(playlists.filter((playlist) => playlist._id !== playlistId));

      // If this was the selected playlist, clear it
      if (selectedPlaylist && selectedPlaylist._id === playlistId) {
        setSelectedPlaylist(null);
      }
    } catch (err) {
      console.error('Error deleting playlist:', err);
      throw err;
    }
  };

  // View playlist details and its songs
  const handleViewPlaylist = async (playlistId) => {
    try {
      // First fetch the playlist details
      const playlistResponse = await fetch(
        `${API_URL}/playlists/${playlistId}`
      );
      if (!playlistResponse.ok) {
        throw new Error('Failed to fetch playlist details');
      }
      const playlistData = await playlistResponse.json();

      // Then fetch the songs in this playlist
      const playlistSongsResponse = await fetch(
        `${API_URL}/playlists/${playlistId}/songs`
      );
      if (!playlistSongsResponse.ok) {
        throw new Error('Failed to fetch playlist songs');
      }
      const playlistSongs = await playlistSongsResponse.json();

      // Set the selected playlist with its songs
      const detailedPlaylist = {
        ...playlistData,
        playlistSongs: playlistSongs,
      };

      setSelectedPlaylist(detailedPlaylist);
      setActiveTab('playlists');
      return detailedPlaylist;
    } catch (err) {
      console.error('Error viewing playlist:', err);
      throw err;
    }
  };

  // Add a song to a playlist
  const handleAddSongToPlaylist = async (playlistId, songId) => {
    try {
      const response = await fetch(`${API_URL}/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add song to playlist');
      }

      // Refresh the playlist to show the updated songs
      if (selectedPlaylist && selectedPlaylist._id === playlistId) {
        handleViewPlaylist(playlistId);
      }
    } catch (err) {
      console.error('Error adding song to playlist:', err);
      throw err;
    }
  };

  // Remove a song from a playlist
  const handleRemoveSongFromPlaylist = async (playlistId, songId) => {
    try {
      const response = await fetch(
        `${API_URL}/playlists/${playlistId}/songs/${songId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove song from playlist');
      }

      // Refresh the playlist to show the updated songs
      if (selectedPlaylist && selectedPlaylist._id === playlistId) {
        handleViewPlaylist(playlistId);
      }
    } catch (err) {
      console.error('Error removing song from playlist:', err);
      throw err;
    }
  };

  return {
    handleAddPlaylist,
    handleUpdatePlaylist,
    handleDeletePlaylist,
    handleViewPlaylist,
    handleAddSongToPlaylist,
    handleRemoveSongFromPlaylist,
  };
}
