import SongDetails from '../components/SongDetails';

function SongDetailsSection({ songDetails, playlists, onAddToPlaylist }) {
  return (
    <div className="song-details-section">
      <h2>Song Details</h2>
      <SongDetails
        song={songDetails}
        playlists={playlists}
        onAddToPlaylist={onAddToPlaylist}
      />
    </div>
  );
}

export default SongDetailsSection;
