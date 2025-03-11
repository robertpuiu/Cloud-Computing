const { ObjectId } = require('mongodb');
const { getDb, SONGS } = require('../config/db');

async function getAllSongs() {
  const db = getDb();
  return await db.collection(SONGS).find({}).toArray();
}

async function getSongById(id) {
  try {
    const db = getDb();
    const objectId = new ObjectId(id);
    return await db.collection(SONGS).findOne({ _id: objectId });
  } catch (error) {
    throw new Error('Invalid ID format');
  }
}

async function createSong(songData) {
  const db = getDb();
  const result = await db.collection(SONGS).insertOne(songData);
  return {
    _id: result.insertedId,
    ...songData,
    location: `/songs/${result.insertedId}`,
  };
}

async function updateSong(id, songData) {
  try {
    const db = getDb();
    const objectId = new ObjectId(id);
    const result = await db
      .collection(SONGS)
      .replaceOne({ _id: objectId }, songData);
    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      _id: id,
      ...songData,
    };
  } catch (error) {
    throw new Error('Invalid ID format');
  }
}

async function deleteSong(id) {
  try {
    const db = getDb();
    const objectId = new ObjectId(id);
    const result = await db.collection(SONGS).deleteOne({ _id: objectId });
    return {
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    throw new Error('Invalid ID format');
  }
}

async function getSongsByIds(ids) {
  const db = getDb();

  const objectIds = ids.map((id) => {
    return typeof id === 'string' ? new ObjectId(id) : id;
  });

  return await db
    .collection(SONGS)
    .find({ _id: { $in: objectIds } })
    .toArray();
}

module.exports = {
  getAllSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
  getSongsByIds,
};
