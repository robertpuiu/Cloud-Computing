const {
  handlePlaylistSongsCollection,
  handlePlaylistSongResource,
} = require('../controllers/playlistSongController');

async function playlistSongRoutes(req, res, pathSegments) {
  const playlistId = pathSegments[1];
  const songId = pathSegments[3];

  if (!songId) {
    await handlePlaylistSongsCollection(req, res, playlistId);
  } else {
    await handlePlaylistSongResource(req, res, playlistId, songId);
  }
}

module.exports = playlistSongRoutes;
