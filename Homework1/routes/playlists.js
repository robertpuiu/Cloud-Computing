const {
  handlePlaylistsCollection,
  handlePlaylistResource,
} = require('../controllers/playlistController');

async function playlistRoutes(req, res, pathSegments) {
  const id = pathSegments[1];

  if (!id) {
    await handlePlaylistsCollection(req, res);
  } else {
    await handlePlaylistResource(req, res, id);
  }
}

module.exports = playlistRoutes;
