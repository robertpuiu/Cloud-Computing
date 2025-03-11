const {
  handleSongsCollection,
  handleSongResource,
} = require('../controllers/songController');

async function songRoutes(req, res, pathSegments) {
  const id = pathSegments[1];

  if (!id) {
    await handleSongsCollection(req, res);
  } else {
    await handleSongResource(req, res, id);
  }
}

module.exports = songRoutes;
