import { CurrentSession } from './CurrentSession';
import formUrlEncoded = require('form-urlencoded');
import express = require('express');
import h = require('axios');
const axios = h.default;
const app = express();

const config: { refresh_token: string, client_id: string, client_secret: string; } = require('./config.json');

const refresh_token = config.refresh_token;
let access_token: string;

interface CurrentTrackDetails {
    track: string;
    artist: string;
    is_playing: boolean;
}

interface SpotifyResponse {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
    error?: string,
    error_description?: string;
}

let currentTrackDetails: CurrentTrackDetails = {
    track: null,
    artist: null,
    is_playing: false,
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
    }
    else {
        currentTrackDetails.track = songData.item.name;
        currentTrackDetails.artist = songData.item.artists[0].name;
        currentTrackDetails.is_playing = songData.is_playing;
    }
}

setInterval(() => {
    refreshToken();
}, 3600000);
refreshToken();

setInterval(() => {
    updateSpotifySong();
}, 5000);
updateSpotifySong();

app.get('/spotify', async (_req, res) => {
    res.status(200);
    res.send(JSON.stringify(currentTrackDetails));
});

app.listen(8001);
console.log("Ready");
