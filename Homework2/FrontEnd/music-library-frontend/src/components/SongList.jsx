// components/SongList.jsx
import { useState } from 'react';
import SongForm from './SongForm';

function SongList({
  songs,
  onUpdate,
  onDelete,
  playlists,
  onAddToPlaylist,
  onViewDetails,
}) {
  const [editingSongId, setEditingSongId] = useState(null);
  const [showPlaylistsForSongId, setShowPlaylistsForSongId] = useState(null);

  // Handle update form submission
  const handleUpdateSubmit = (songData) => {
    onUpdate(editingSongId, songData);
    setEditingSongId(null);
  };

  // Format duration from seconds to mm:ss
  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '-';

    const mins = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="song-list">
      {songs.length === 0 ? (
        <p>No songs in the library yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Genre</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song._id}>
                {editingSongId === song._id ? (
                  <td colSpan="5">
                    <SongForm
                      initialData={song}
                      onSubmit={handleUpdateSubmit}
                      onCancel={() => setEditingSongId(null)}
                    />
                  </td>
                ) : (
                  <>
                    <td>{song.title}</td>
                    <td>{song.artist}</td>
                    <td>{song.album || '-'}</td>
                    <td>{song.genre || '-'}</td>
                    <td>{formatDuration(song.duration)}</td>
                  </>
                )}
                {editingSongId !== song._id && (
                  <td className="song-actions">
                    <button onClick={() => onViewDetails(song._id)}>
                      Details
                    </button>
                    <button onClick={() => setEditingSongId(song._id)}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => onDelete(song._id)}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        setShowPlaylistsForSongId(
                          showPlaylistsForSongId === song._id ? null : song._id
                        )
                      }
                    >
                      Add to playlist
                    </button>

                    {showPlaylistsForSongId === song._id && (
                      <div className="playlist-dropdown">
                        {playlists.length === 0 ? (
                          <p>No playlists available</p>
                        ) : (
                          <ul>
                            {playlists.map((playlist) => (
                              <li key={playlist._id}>
                                <button
                                  onClick={() => {
                                    onAddToPlaylist(playlist._id, song._id);
                                    setShowPlaylistsForSongId(null);
                                  }}
                                >
                                  {playlist.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SongList;

