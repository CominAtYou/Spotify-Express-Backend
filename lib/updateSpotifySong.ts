import axios from "axios";
import CurrentSession from "./interfaces/CurrentSession";
import { accessToken } from "./tokenUtil";

export default async function updateSpotifySong() {
    const d = await axios.get("https://api.spotify.com/v1/me/player/currently-playing?market=US", { headers: { Authorization: `Bearer ${accessToken}` } });
    const songData: CurrentSession = d.data;
    // Spotify returns 204 when no songs are playing.
    if (d.status === 204) return {
        track: null, artist: null, is_playing: false, track_url: null
    };
    else return {
        track: songData.item.name,
        artist: songData.item.artists[0].name,
        is_playing: songData.is_playing,
        track_url: songData.item.external_urls.spotify
    }
}
