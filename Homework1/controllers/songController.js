const { sendResponse, parseBody } = require('../utils/response');
const songModel = require('../models/song');

async function handleSongsCollection(req, res) {
  const method = req.method;

  try {
    switch (method) {
      case 'GET':
        const allSongs = await songModel.getAllSongs();
        return sendResponse(res, 200, allSongs);

      case 'POST':
        const newSong = await parseBody(req);

        // solid af
        if (!newSong.title || !newSong.artist) {
          return sendResponse(res, 400, {
            error: 'Title and artist are required fields',
          });
        }

        const createdSong = await songModel.createSong(newSong);
        return sendResponse(res, 201, createdSong);

      default:
        return sendResponse(res, 405, {
          error: 'Method not allowed on collection',
        });
    }
  } catch (error) {
    console.error('Error handling songs collection request:', error);
    return sendResponse(res, 500, { error: 'Internal server error' });
  }
}

async function handleSongResource(req, res, id) {
  const method = req.method;

  try {
    switch (method) {
      case 'GET':
        const song = await songModel.getSongById(id);
        if (!song) {
          return sendResponse(res, 404, { error: 'Song not found' });
        }
        return sendResponse(res, 200, song);

      case 'PUT':
        const songData = await parseBody(req);

        if (!songData.title || !songData.artist) {
          return sendResponse(res, 400, {
            error: 'Title and artist are required fields',
          });
        }

        const updateResult = await songModel.updateSong(id, songData);
        if (updateResult.matchedCount === 0) {
          return sendResponse(res, 404, { error: 'Song not found' });
        }
        return sendResponse(res, 200, updateResult);

      case 'DELETE':
        const deleteResult = await songModel.deleteSong(id);
        if (deleteResult.deletedCount === 0) {
          return sendResponse(res, 404, { error: 'Song not found' });
        }
        return sendResponse(res, 200, { message: 'Song successfully deleted' });

      default:
        return sendResponse(res, 405, {
          error: 'Method not allowed on resource',
        });
    }
  } catch (error) {
    if (error.message === 'Invalid ID format') {
      return sendResponse(res, 400, { error: 'Invalid ID format' });
    }
    console.error('Error handling song resource request:', error);
    return sendResponse(res, 500, { error: 'Internal server error' });
  }
}

module.exports = {
  handleSongsCollection,
  handleSongResource,
};
