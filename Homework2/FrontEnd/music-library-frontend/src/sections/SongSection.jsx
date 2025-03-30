import SongList from '../components/SongList';
import SongForm from '../components/SongForm';

function SongSection({
  songs,
  playlists,
  isSearchResults,
  onAddSong,
  onUpdateSong,
  onDeleteSong,
  onAddToPlaylist,
  onViewDetails,
}) {
  return (
    <div className="songs-section">
      <h2>{isSearchResults ? 'Search Results' : 'Songs'}</h2>
      <SongForm onSubmit={onAddSong} />
      <SongList
        songs={songs}
        onUpdate={onUpdateSong}
        onDelete={onDeleteSong}
        playlists={playlists}
        onAddToPlaylist={onAddToPlaylist}
        onViewDetails={onViewDetails}
      />
    </div>
  );
}

export default SongSection;
