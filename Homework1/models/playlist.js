const { ObjectId } = require('mongodb');
const { getDb, PLAYLISTS } = require('../config/db');

async function getAllPlaylists() {
  const db = getDb();
  return await db.collection(PLAYLISTS).find({}).toArray();
}

async function getPlaylistById(id) {
  try {
    const db = getDb();
    const objectId = new ObjectId(id);
    return await db.collection(PLAYLISTS).findOne({ _id: objectId });
  } catch (error) {
    throw new Error('Invalid ID format');
  }
}

async function createPlaylist(playlistData) {
  const db = getDb();

  // Initialize songs array if not provided
  if (!playlistData.songs) {
    playlistData.songs = [];
  }

  const result = await db.collection(PLAYLISTS).insertOne(playlistData);
  return {
    _id: result.insertedId,
    ...playlistData,
    location: `/playlists/${result.insertedId}`,
  };
}

async function updatePlaylist(id, playlistData) {
  try {
    const db = getDb();
    const objectId = new ObjectId(id);
    const result = await db
      .collection(PLAYLISTS)
      .replaceOne({ _id: objectId }, playlistData);
    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      _id: id,
      ...playlistData,
    };
  } catch (error) {
    throw new Error('Invalid ID format');
  }
}

async function deletePlaylist(id) {
  try {
    const db = getDb();
    const objectId = new ObjectId(id);
    const result = await db.collection(PLAYLISTS).deleteOne({ _id: objectId });
    return {
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    throw new Error('Invalid ID format');
  }
}

async function addSongToPlaylist(playlistId, songId) {
  try {
    const db = getDb();
    const playlistObjectId = new ObjectId(playlistId);
    const songObjectId = new ObjectId(songId);

    const result = await db
      .collection(PLAYLISTS)
      .updateOne(
        { _id: playlistObjectId },
        { $addToSet: { songs: songObjectId } }
      );

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  } catch (error) {
    throw new Error('Invalid ID format');
  }
}

async function removeSongFromPlaylist(playlistId, songId) {
  try {
    const db = getDb();
    const playlistObjectId = new ObjectId(playlistId);
    const songObjectId = new ObjectId(songId);

    const result = await db
      .collection(PLAYLISTS)
      .updateOne({ _id: playlistObjectId }, { $pull: { songs: songObjectId } });

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  } catch (error) {
    throw new Error('Invalid ID format');
  }
}

module.exports = {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
};
