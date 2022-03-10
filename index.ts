import CurrentSession from './lib/interfaces/CurrentSession';
import formUrlEncoded = require('form-urlencoded');
import express = require('express');
import h = require('axios');
import SpotifyResponse from './lib/interfaces/SpotifyResponse';
import CurrentTrackDetails from './lib/interfaces/CurrentTrackDetails';
const axios = h.default;
const app = express();
const PORT = 8001;

const config: { refresh_token: string, client_id: string, client_secret: string; } = require('./config.json');

const refresh_token = config.refresh_token;
let access_token: string;

const currentTrackDetails: CurrentTrackDetails = {
    track: null,
    artist: null,
    is_playing: false,
    track_url: null
};

async function refreshToken() {
    const d: { data: SpotifyResponse; } = await axios.post("https://accounts.spotify.com/api/token", formUrlEncoded({ grant_type: "refresh_token", refresh_token: refresh_token }), { headers: { Authorization: `Basic ${Buffer.from(`${config.client_id}:${config.client_secret}`).toString('base64')}` } });
    access_token = d.data.access_token;
}

async function updateSpotifySong() {
    const d = await axios.get("https://api.spotify.com/v1/me/player/currently-playing?market=US", { headers: { Authorization: `Bearer ${access_token}` } });
    const songData: CurrentSession = d.data;
    // Spotify returns 204 when no songs are playing.
    if (d.status === 204) {
        currentTrackDetails.track = null;
        currentTrackDetails.artist = null;
        currentTrackDetails.is_playing = false;
        currentTrackDetails.track_url = null;

    }
    else {
        currentTrackDetails.track = songData.item.name;
        currentTrackDetails.artist = songData.item.artists[0].name;
        currentTrackDetails.is_playing = songData.is_playing;
        currentTrackDetails.track_url = songData.item.external_urls.spotify;
    }
}

// refresh the token every hour
setInterval(refreshToken, 60 * 60 * 1000);
refreshToken();

// update the song every 5 seconds
setInterval(updateSpotifySong, 5 * 1000);
// not calling updateSpotifySong() here because it fails the first time it is called (possible race condition?)

app.get('/spotify', async (req, res) => {
    res.status(200);
    if ((/^(.*\.)?(cominatyou\.com)$/).test(req.get(origin))) {
        res.setHeader("Access-Control-Allow-Origin", req.get('origin'));
    }
    res.setHeader('content-type', 'application/json');
    res.json(currentTrackDetails);
});

app.get('/silverpoint/updates', (_req, res) => {
    res.sendFile("/home/willi/Yamanashi/Documents/Random Stuff/SilverpointUpdateData.json");
});

app.listen(PORT);

// print "Ready" and the port the app is running on.
console.log(`Ready on port ${PORT}`);
