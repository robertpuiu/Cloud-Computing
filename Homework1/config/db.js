const { MongoClient } = require('mongodb');

const mongoURI = 'no way';
const dbName = 'musicLibrary';

const SONGS = 'songs';
const PLAYLISTS = 'playlists';

let db;

async function connectToDatabase() {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
}

module.exports = {
  connectToDatabase,
  getDb,
  SONGS,
  PLAYLISTS,
};
