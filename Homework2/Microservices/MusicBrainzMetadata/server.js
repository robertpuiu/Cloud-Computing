require('dotenv').config();
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const metadataSchema = new mongoose.Schema(
  {
    songId: { type: String, required: true, unique: true },
    title: String,
    artist: String,
    album: String,
    releaseDate: String,
    genre: String,
  },
  { timestamps: true }
);

const Metadata = mongoose.model('Metadata', metadataSchema);

async function getSongDetails(songId) {
  try {
    const response = await axios.get(`http://localhost:3000/songs/${songId}`);
    const { title, artist, album, genre } = response.data;
    return { title, artist, album, genre, songId: response.data._id || songId };
  } catch (error) {
    throw new Error('Error fetching song details from Music Library API');
  }
}

async function getMusicBrainzMetadata(songDetails) {
  const query = `recording:${encodeURIComponent(
    songDetails.title
  )} AND artist:${encodeURIComponent(songDetails.artist)}`;
  const url = `https://musicbrainz.org/ws/2/recording/?query=${query}&fmt=json&limit=1`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'MusicApp/1.0 ( your-email@example.com )',
      },
    });
    if (response.data.recordings && response.data.recordings.length > 0) {
      const recording = response.data.recordings[0];
      return {
        songId: songDetails.songId,
        title: recording.title || songDetails.title,
        artist:
          (recording['artist-credit'] && recording['artist-credit'][0].name) ||
          songDetails.artist,
        album: songDetails.album || 'Unknown Album',
        releaseDate: recording['first-release-date'] || 'Unknown',
        genre: songDetails.genre || 'Unknown',
      };
    } else {
      throw new Error('No metadata found in MusicBrainz API');
    }
  } catch (error) {
    throw new Error(
      'Error fetching metadata from MusicBrainz API: ' + error.message
    );
  }
}

app.get('/metadata/:songId', async (req, res) => {
  const { songId } = req.params;
  try {
    const songDetails = await getSongDetails(songId);
    const metadata = await getMusicBrainzMetadata(songDetails);
    return res.status(200).json(metadata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.post('/metadata/:songId', async (req, res) => {
  const { songId } = req.params;
  try {
    const songDetails = await getSongDetails(songId);
    const metadataData = await getMusicBrainzMetadata(songDetails);
    const minimalData = {
      songId: metadataData.songId,
      title: metadataData.title,
      artist: metadataData.artist,
      album: metadataData.album,
      releaseDate: metadataData.releaseDate,
      genre: metadataData.genre,
    };
    // Upsert operation: create or update the metadata document
    const savedMetadata = await Metadata.findOneAndUpdate(
      { songId },
      minimalData,
      { new: true, upsert: true }
    );
    return res.status(201).json({
      message: 'Metadata saved successfully',
      metadata: savedMetadata,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/metadata/:songId', async (req, res) => {
  const { songId } = req.params;
  try {
    const deletedMetadata = await Metadata.findOneAndDelete({ songId });
    if (!deletedMetadata) {
      return res
        .status(404)
        .json({ error: 'No metadata found for the provided songId' });
    }
    return res
      .status(200)
      .json({ message: `Metadata deleted successfully for songId: ${songId}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/metadata', async (req, res) => {
  try {
    const allMetadata = await Metadata.find();
    return res.status(200).json(allMetadata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`MusicBrainz Metadata Microservice is running on port ${PORT}`);
});
