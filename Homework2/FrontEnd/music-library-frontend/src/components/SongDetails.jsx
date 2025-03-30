// components/SongDetails.jsx
import { useState } from 'react';

function SongDetails({ song, playlists, onAddToPlaylist }) {
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);

  // Format metadata for display
  const metadataDisplay = () => {
    if (!song.metadata) {
      return <p>No metadata available</p>;
    }

    return (
      <div className="metadata-details">
        <h4>Metadata from MusicBrainz</h4>
        <table>
          <tbody>
            {Object.entries(song.metadata).map(([key, value]) => {
              // Skip the songId field
              if (key === 'songId' || key === '_id') return null;

              return (
                <tr key={key}>
                  <th>
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </th>
                  <td>{value?.toString() || 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Format lyrics for display
  const lyricsDisplay = () => {
    if (!song.lyrics) {
      return <p>No lyrics available</p>;
    }

    // Split lyrics by newlines and preserve whitespace
    return (
      <div className="lyrics-content">
        {song.lyrics.split('\n').map((line, index) => (
          <p key={index}>{line || <br />}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="song-details">
      <div className="song-basics">
        <h3>{song.title}</h3>
        <p className="artist">by {song.artist}</p>
        {song.album && <p className="album">Album: {song.album}</p>}
        {song.genre && <p className="genre">Genre: {song.genre}</p>}
        {song.duration && (
          <p className="duration">
            Duration: {Math.floor(song.duration / 60)}:
            {String(song.duration % 60).padStart(2, '0')}
          </p>
        )}
        {song.year && <p className="year">Year: {song.year}</p>}

        <div className="song-actions">
          <button
            onClick={() => setShowPlaylistDropdown(!showPlaylistDropdown)}
            className="add-to-playlist-btn"
          >
            Add to Playlist
          </button>

          {showPlaylistDropdown && (
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
                          setShowPlaylistDropdown(false);
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
        </div>
      </div>

      <div className="song-info-tabs">
        <div className="metadata-section">
          <h3>Song Metadata</h3>
          {metadataDisplay()}
        </div>

        <div className="lyrics-section">
          <h3>Lyrics</h3>
          {lyricsDisplay()}
        </div>
      </div>
    </div>
  );
}

export default SongDetails;
