// mainBackend.js

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 6001;

const MUSIC_LIBRARY_API_URL =
  process.env.MUSIC_LIBRARY_API_URL || 'http://localhost:3000';
const METADATA_API_URL =
  process.env.METADATA_API_URL || 'http://localhost:4000';
const LYRICS_API_URL = process.env.LYRICS_API_URL || 'http://localhost:5000';

app.use(
  cors({
    origin: 'http://localhost:5173', // React
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// SONGS ENDPOINTS (forwarded to Music Library API)

app.get('/api/songs', async (req, res) => {
  try {
    const response = await axios.get(`${MUSIC_LIBRARY_API_URL}/songs`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/songs/:songId', async (req, res) => {
  const { songId } = req.params;
  try {
    const response = await axios.get(
      `${MUSIC_LIBRARY_API_URL}/songs/${songId}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/songs', async (req, res) => {
  try {
    const response = await axios.post(
      `${MUSIC_LIBRARY_API_URL}/songs`,
      req.body
    );
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/songs/:songId', async (req, res) => {
  const { songId } = req.params;
  try {
    const response = await axios.put(
      `${MUSIC_LIBRARY_API_URL}/songs/${songId}`,
      req.body
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/songs/:songId', async (req, res) => {
  const { songId } = req.params;
  try {
    const response = await axios.delete(
      `${MUSIC_LIBRARY_API_URL}/songs/${songId}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// METADATA ENDPOINTS (forwarded to MusicBrainz Metadata Microservice)

app.get('/api/metadata', async (req, res) => {
  try {
    const response = await axios.get(`${METADATA_API_URL}/metadata`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/metadata/:songId', async (req, res) => {
  const { songId } = req.params;
  try {
    const response = await axios.get(`${METADATA_API_URL}/metadata/${songId}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/metadata/:songId', async (req, res) => {
  const { songId } = req.params;
  try {
    const response = await axios.post(
      `${METADATA_API_URL}/metadata/${songId}`,
      req.body
    );
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/metadata/:songId', async (req, res) => {
  const { songId } = req.params;
  try {
    const response = await axios.delete(
      `${METADATA_API_URL}/metadata/${songId}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LYRICS ENDPOINT (forwarded to Lyrics Microservice)

app.get('/api/lyrics/:songId', async (req, res) => {
  const { songId } = req.params;
  try {
    const response = await axios.get(`${LYRICS_API_URL}/lyrics/${songId}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Main Backend is running on port ${PORT}`);
});
