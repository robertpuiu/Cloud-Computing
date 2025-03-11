const { sendResponse, parseBody } = require('../utils/response');
const playlistModel = require('../models/playlist');

async function handlePlaylistsCollection(req, res) {
  const method = req.method;

  try {
    switch (method) {
      case 'GET':
        const allPlaylists = await playlistModel.getAllPlaylists();
        return sendResponse(res, 200, allPlaylists);

      case 'POST':
        const newPlaylist = await parseBody(req);

        if (!newPlaylist.name) {
          return sendResponse(res, 400, { error: 'Playlist name is required' });
        }

        const createdPlaylist = await playlistModel.createPlaylist(newPlaylist);
        return sendResponse(res, 201, createdPlaylist);

      default:
        return sendResponse(res, 405, {
          error: 'Method not allowed on collection',
        });
    }
  } catch (error) {
    console.error('Error handling playlists collection request:', error);
    return sendResponse(res, 500, { error: 'Internal server error' });
  }
}

async function handlePlaylistResource(req, res, id) {
  const method = req.method;

  try {
    switch (method) {
      case 'GET':
        const playlist = await playlistModel.getPlaylistById(id);
        if (!playlist) {
          return sendResponse(res, 404, { error: 'Playlist not found' });
        }
        return sendResponse(res, 200, playlist);

      case 'PUT':
        const playlistData = await parseBody(req);

        if (!playlistData.name) {
          return sendResponse(res, 400, { error: 'Playlist name is required' });
        }

        const updateResult = await playlistModel.updatePlaylist(
          id,
          playlistData
        );
        if (updateResult.matchedCount === 0) {
          return sendResponse(res, 404, { error: 'Playlist not found' });
        }
        return sendResponse(res, 200, updateResult);

      case 'DELETE':
        const deleteResult = await playlistModel.deletePlaylist(id);
        if (deleteResult.deletedCount === 0) {
          return sendResponse(res, 404, { error: 'Playlist not found' });
        }
        return sendResponse(res, 200, {
          message: 'Playlist successfully deleted',
        });

      default:
        return sendResponse(res, 405, {
          error: 'Method not allowed on resource',
        });
    }
  } catch (error) {
    if (error.message === 'Invalid ID format') {
      return sendResponse(res, 400, { error: 'Invalid ID format' });
    }
    console.error('Error handling playlist resource request:', error);
    return sendResponse(res, 500, { error: 'Internal server error' });
  }
}

module.exports = {
  handlePlaylistsCollection,
  handlePlaylistResource,
};
