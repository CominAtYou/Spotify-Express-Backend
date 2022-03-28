import axios from "axios";
import formUrlEncoded = require('form-urlencoded');
import spotifyAuth from "./spotifyAuth";

export let accessToken = null;

export async function refreshToken() {
    const d: { data: { access_token: string; }; } = await axios.post("https://accounts.spotify.com/api/token", formUrlEncoded({ grant_type: "refresh_token", refresh_token: spotifyAuth.refreshToken }), { headers: { Authorization: `Basic ${Buffer.from(`${spotifyAuth.clientId}:${spotifyAuth.clientSecret}`).toString('base64')}` } });
    accessToken = d.data.access_token;
}
