import { useState } from 'react';
import './App.css';
import SongSection from './sections/SongSection';
import PlaylistSection from './sections/PlaylistSection';
import SongDetailsSection from './sections/SongDetailsSection';
import { useAppData } from './hooks/useAppData';
import { useSongActions } from './hooks/useSongActions';
import { usePlaylistActions } from './hooks/usePlaylistActions';

export const API_URL = 'http://localhost:6001/api';

function App() {
  const [activeTab, setActiveTab] = useState('songs'); // 'songs', 'playlists', 'songDetails'
  const [selectedSongDetails, setSelectedSongDetails] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const { songs, setSongs, playlists, setPlaylists, loading, error } =
    useAppData();

  const {
    handleAddSong,
    handleUpdateSong,
    handleDeleteSong,
    handleViewSongDetails,
  } = useSongActions({
    songs,
    setSongs,
    setSelectedSongDetails,
    setActiveTab,
  });

  const {
    handleAddPlaylist,
    handleUpdatePlaylist,
    handleDeletePlaylist,
    handleViewPlaylist,
    handleAddSongToPlaylist,
    handleRemoveSongFromPlaylist,
  } = usePlaylistActions({
    playlists,
    setPlaylists,
    setSelectedPlaylist,
    selectedPlaylist,
    setActiveTab,
  });

  if (loading && !songs.length && !playlists.length) {
    return <div className="loading">Loading...</div>;
  }

  if (error && !songs.length && !playlists.length) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Music Library</h1>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'songs' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('songs');
              setSelectedSongDetails(null);
              setSelectedPlaylist(null);
            }}
          >
            Songs
          </button>
          <button
            className={`tab ${activeTab === 'playlists' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('playlists');
              setSelectedSongDetails(null);
            }}
          >
            Playlists
          </button>
          {selectedSongDetails && (
            <button
              className={`tab ${activeTab === 'songDetails' ? 'active' : ''}`}
              onClick={() => setActiveTab('songDetails')}
            >
              Song Details
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'songs' && (
          <SongSection
            songs={songs}
            playlists={playlists}
            onAddSong={handleAddSong}
            onUpdateSong={handleUpdateSong}
            onDeleteSong={handleDeleteSong}
            onAddToPlaylist={handleAddSongToPlaylist}
            onViewDetails={handleViewSongDetails}
          />
        )}

        {activeTab === 'playlists' && (
          <PlaylistSection
            playlists={playlists}
            songs={songs}
            selectedPlaylist={selectedPlaylist}
            onAddPlaylist={handleAddPlaylist}
            onUpdatePlaylist={handleUpdatePlaylist}
            onDeletePlaylist={handleDeletePlaylist}
            onViewPlaylist={handleViewPlaylist}
            onAddSong={handleAddSongToPlaylist}
            onRemoveSong={handleRemoveSongFromPlaylist}
            onViewSongDetails={handleViewSongDetails}
          />
        )}

        {activeTab === 'songDetails' && selectedSongDetails && (
          <SongDetailsSection
            songDetails={selectedSongDetails}
            playlists={playlists}
            onAddToPlaylist={handleAddSongToPlaylist}
          />
        )}
      </main>
    </div>
  );
}

export default App;

