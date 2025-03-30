import { useState } from 'react';
import PlaylistForm from './PlaylistForm';

function PlaylistList({
  playlists,
  onUpdate,
  onDelete,
  onView,
  selectedPlaylistId,
}) {
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);

  // Handle update form submission
  const handleUpdateSubmit = (playlistData) => {
    onUpdate(editingPlaylistId, playlistData);
    setEditingPlaylistId(null);
  };

  return (
    <div className="playlist-list">
      {playlists.length === 0 ? (
        <p>No playlists yet. Create one above!</p>
      ) : (
        <ul className="playlists">
          {playlists.map((playlist) => (
            <li
              key={playlist._id}
              className={`playlist-item ${
                selectedPlaylistId === playlist._id ? 'selected' : ''
              }`}
            >
              {editingPlaylistId === playlist._id ? (
                <PlaylistForm
                  initialData={playlist}
                  onSubmit={handleUpdateSubmit}
                  onCancel={() => setEditingPlaylistId(null)}
                />
              ) : (
                <div className="playlist-content">
                  <div
                    className="playlist-info"
                    onClick={() => onView(playlist._id)}
                  >
                    <h3>{playlist.name}</h3>
                    {playlist.description && <p>{playlist.description}</p>}
                    <p className="song-count">
                      {playlist.songs ? playlist.songs.length : 0} songs
                    </p>
                  </div>

                  <div className="playlist-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPlaylistId(playlist._id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(playlist._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlaylistList;

