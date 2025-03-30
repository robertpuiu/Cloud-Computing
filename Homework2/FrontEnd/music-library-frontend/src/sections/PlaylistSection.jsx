import PlaylistList from '../components/PlaylistList';
import PlaylistForm from '../components/PlaylistForm';
import PlaylistDetail from '../components/PlaylistDetail';

function PlaylistSection({
  playlists,
  songs,
  selectedPlaylist,
  onAddPlaylist,
  onUpdatePlaylist,
  onDeletePlaylist,
  onViewPlaylist,
  onAddSong,
  onRemoveSong,
  onViewSongDetails,
}) {
  return (
    <div className="playlists-section">
      <h2>Playlists</h2>
      <PlaylistForm onSubmit={onAddPlaylist} />
      <div className="playlists-container">
        <div className="playlists-list-container">
          <PlaylistList
            playlists={playlists}
            onUpdate={onUpdatePlaylist}
            onDelete={onDeletePlaylist}
            onView={onViewPlaylist}
            selectedPlaylistId={selectedPlaylist?._id}
          />
        </div>

        {selectedPlaylist && (
          <div className="playlist-detail-container">
            <PlaylistDetail
              playlist={selectedPlaylist}
              songs={songs}
              onAddSong={onAddSong}
              onRemoveSong={onRemoveSong}
              onViewSongDetails={onViewSongDetails}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistSection;
