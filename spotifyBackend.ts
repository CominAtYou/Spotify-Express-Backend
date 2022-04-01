import { Request, Response } from "express";
import CurrentTrackDetails from "./lib/interfaces/CurrentTrackDetails"
import { refreshToken } from "./lib/tokenUtil";
import updateSpotifySong from "./lib/updateSpotifySong";

let currentTrackDetails: CurrentTrackDetails = {
    track: null,
    artist: null,
    is_playing: null,
    track_url: null,
}

let lastUpdated: number = null;
let tokenLastRefreshed: number = null;

export default async function spotifyBackend(req: Request, res: Response) {
    const now = new Date().getTime();

    if (tokenLastRefreshed === null || now - tokenLastRefreshed > 60 * 60 * 1000) {
        console.log("[SPOTIFY] Access token was refreshed");
        await refreshToken();
        tokenLastRefreshed = now;
    }

    if (lastUpdated === null || now - lastUpdated > 5000) {
        console.log("[SPOTIFY] Updated playback state");
        currentTrackDetails = await updateSpotifySong();
        lastUpdated = now;
    }

    if ((/^https?:\/\/(.*\.)?cominatyou\.com$/).test(req.headers.origin)) {
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    }

    res.json(currentTrackDetails);
}
