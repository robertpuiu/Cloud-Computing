import { useState } from 'react';

function PlaylistDetail({ playlist, songs, onAddSong, onRemoveSong }) {
  const [showSongSelector, setShowSongSelector] = useState(false);

  const playlistSongs = playlist.playlistSongs || [];

  const availableSongs = songs.filter(
    (song) => !playlistSongs.some((ps) => ps._id === song._id)
  );

  return (
    <div className="playlist-detail">
      <div className="playlist-header">
        <h3>{playlist.name}</h3>
        {playlist.description && <p>{playlist.description}</p>}
      </div>

      <div className="playlist-songs">
        <div className="playlist-songs-header">
          <h4>Songs in Playlist</h4>
          <button onClick={() => setShowSongSelector(!showSongSelector)}>
            {showSongSelector ? 'Cancel' : 'Add Songs'}
          </button>
        </div>

        {showSongSelector && (
          <div className="song-selector">
            <h5>Available Songs</h5>
            {availableSongs.length === 0 ? (
              <p>No more songs available to add</p>
            ) : (
              <ul>
                {availableSongs.map((song) => (
                  <li key={song._id}>
                    <span>
                      {song.title} - {song.artist}
                    </span>
                    <button
                      onClick={() => {
                        onAddSong(playlist._id, song._id);
                        setShowSongSelector(false);
                      }}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {playlistSongs.length === 0 ? (
          <p>No songs in this playlist yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Album</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {playlistSongs.map((song) => (
                <tr key={song._id}>
                  <td>{song.title}</td>
                  <td>{song.artist}</td>
                  <td>{song.album || '-'}</td>
                  <td>{formatDuration(song.duration)}</td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => onRemoveSong(playlist._id, song._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '-';

  const mins = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

export default PlaylistDetail;

