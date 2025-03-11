const http = require('http');
const url = require('url');
const { connectToDatabase } = require('./config/db');
const { sendResponse } = require('./utils/response');
const songRoutes = require('./routes/songs');
const playlistRoutes = require('./routes/playlists');
const playlistSongRoutes = require('./routes/playlistSongs');

const port = 3000;

async function router(req, res) {
  try {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const pathSegments = pathname.split('/').filter((segment) => segment);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return sendResponse(res, 204, null);
    }

    if (pathSegments[0] === 'songs') {
      await songRoutes(req, res, pathSegments);
    } else if (pathSegments[0] === 'playlists') {
      if (pathSegments[2] === 'songs') {
        await playlistSongRoutes(req, res, pathSegments);
      } else {
        await playlistRoutes(req, res, pathSegments);
      }
    } else {
      if (pathname === '/' || pathname === '') {
        sendResponse(res, 200, {
          message: 'Music Library API',
          endpoints: [
            '/songs',
            '/songs/{id}',
            '/playlists',
            '/playlists/{id}',
            '/playlists/{id}/songs',
            '/playlists/{id}/songs/{songId}',
          ],
        });
      } else {
        sendResponse(res, 404, { error: 'Not found' });
      }
    }
  } catch (error) {
    console.error('Router error:', error);
    sendResponse(res, 500, { error: 'Internal server error' });
  }
}

async function startServer() {
  try {
    await connectToDatabase();

    const server = http.createServer(router);

    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer().catch(console.error);
