import { CurrentSession } from './CurrentSession';
import formUrlEncoded = require('form-urlencoded');
import express = require('express');
import fs = require('fs');
import h = require('axios');
const axios = h.default;
const app = express();

let config: {refresh_token: string, client_id: string, client_secret: string} = JSON.parse(fs.readFileSync('./config.json').toString());

const refresh_token: string = config.refresh_token;
let access_token: string;

interface SpotifyResponse {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
    error?: string,
    error_description?: string;
}

async function refreshToken() {
    const d: {data: SpotifyResponse} = await axios.post("https://accounts.spotify.com/api/token", formUrlEncoded({grant_type: "refresh_token", refresh_token: refresh_token}), {headers: {Authorization: `Basic ${Buffer.from(`${config.client_id}:${config.client_secret}`).toString('base64')}`}})
    access_token = d.data.access_token;
}

async function getSpotifySong() {
    const d = await axios.get("https://api.spotify.com/v1/me/player/currently-playing?market=US", {headers: {Authorization: `Bearer ${access_token}`}})
    const songData: CurrentSession = d.data;
    // Spotify returns 204 when no songs are playing.
    const resData = d.status === 204 ? { track: null, artist: null, is_playing: false } : { track: songData.item.name, artist: songData.item.artists[0].name, is_playing: songData.is_playing };
    return resData;
}

setInterval(() => {
    refreshToken();
}, 3600000);
refreshToken();

app.get('/spotify', async (_req, res) => {
    res.status(200);
    res.send(JSON.stringify(await getSpotifySong()));
});

app.listen(8001);
console.log("Ready");
