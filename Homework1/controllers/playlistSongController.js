const { sendResponse, parseBody } = require('../utils/response');
const playlistModel = require('../models/playlist');
const songModel = require('../models/song');

async function handlePlaylistSongsCollection(req, res, playlistId) {
  const method = req.method;

  try {
    if (method === 'GET') {
      const playlist = await playlistModel.getPlaylistById(playlistId);

      if (!playlist) {
        return sendResponse(res, 404, { error: 'Playlist not found' });
      }

      if (!playlist.songs || playlist.songs.length === 0) {
        return sendResponse(res, 200, []);
      }

      const songs = await songModel.getSongsByIds(playlist.songs);

      return sendResponse(res, 200, songs);
    } else if (method === 'POST') {
      try {
        const body = await parseBody(req);
        const songId = body.songId;

        if (!songId) {
          return sendResponse(res, 400, { error: 'Song ID is required' });
        }

        const song = await songModel.getSongById(songId);

        if (!song) {
          return sendResponse(res, 404, { error: 'Song not found' });
        }

        const result = await playlistModel.addSongToPlaylist(
          playlistId,
          songId
        );

        if (result.matchedCount === 0) {
          return sendResponse(res, 404, { error: 'Playlist not found' });
        }

        return sendResponse(res, 200, { message: 'Song added to playlist' });
      } catch (error) {
        if (error.message === 'Invalid ID format') {
          return sendResponse(res, 400, { error: 'Invalid song ID format' });
        }
        throw error;
      }
    }

    return sendResponse(res, 405, {
      error: 'Method not allowed on this resource',
    });
  } catch (error) {
    if (error.message === 'Invalid ID format') {
      return sendResponse(res, 400, { error: 'Invalid playlist ID format' });
    }
    console.error('Error handling playlist songs collection request:', error);
    return sendResponse(res, 500, { error: 'Internal server error' });
  }
}

async function handlePlaylistSongResource(req, res, playlistId, songId) {
  const method = req.method;

  try {
    if (method === 'DELETE') {
      const result = await playlistModel.removeSongFromPlaylist(
        playlistId,
        songId
      );

      if (result.matchedCount === 0) {
        return sendResponse(res, 404, { error: 'Playlist not found' });
      }

      return sendResponse(res, 200, { message: 'Song removed from playlist' });
    }

    return sendResponse(res, 405, {
      error: 'Method not allowed on this resource',
    });
  } catch (error) {
    if (error.message === 'Invalid ID format') {
      return sendResponse(res, 400, { error: 'Invalid ID format' });
    }
    console.error('Error handling playlist song resource request:', error);
    return sendResponse(res, 500, { error: 'Internal server error' });
  }
}

module.exports = {
  handlePlaylistSongsCollection,
  handlePlaylistSongResource,
};
