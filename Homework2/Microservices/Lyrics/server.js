require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const METADATA_API_URL =
  process.env.METADATA_API_URL || 'http://localhost:4000';

/**
 * GET /lyrics/:songId
 *
 * Process:
 * 1. Retrieve song metadata from the Metadata API using the provided songId.
 * 2. Extract the song title and artist from the metadata.
 * 3. Use the title and artist to query the Lyrics API (lyrics.ovh).
 * 4. Return the songId, title, artist, and lyrics as a JSON response.
 */
app.get('/lyrics/:songId', async (req, res) => {
  const { songId } = req.params;
  try {
    const metadataResponse = await axios.get(
      `${METADATA_API_URL}/metadata/${songId}`
    );
    const metadata = metadataResponse.data;

    const { title, artist } = metadata;
    if (!title || !artist) {
      return res.status(400).json({
        error: 'Metadata does not contain required information (title, artist)',
      });
    }

    const lyricsResponse = await axios.get(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(
        artist
      )}/${encodeURIComponent(title)}`
    );
    const lyricsData = lyricsResponse.data;

    return res.status(200).json({
      songId,
      title,
      artist,
      lyrics: lyricsData.lyrics,
    });
  } catch (error) {
    console.error('Error in GET /lyrics:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Lyrics Microservice is running on port ${PORT}`);
});
