// components/Recommendations.jsx
import { useState } from 'react';

function Recommendations({ songs, playlists, onAddToPlaylist, onViewDetails }) {
  const [showPlaylistsForSongId, setShowPlaylistsForSongId] = useState(null);

  if (!songs || songs.length === 0) {
    return (
      <p>
        No recommendations available. Add more songs to get recommendations!
      </p>
    );
  }

  return (
    <div className="recommendations-list">
      <p className="recommendations-intro">
        Based on your listening preferences, you might enjoy these songs:
      </p>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Genre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song._id}>
              <td>{song.title}</td>
              <td>{song.artist}</td>
              <td>{song.album || '-'}</td>
              <td>{song.genre || '-'}</td>
              <td className="song-actions">
                <button onClick={() => onViewDetails(song._id)}>Details</button>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Recommendations;
