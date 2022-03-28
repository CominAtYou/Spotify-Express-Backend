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

export default async function spotifyBackend(req: Request, res: Response) {
    setInterval(refreshToken, 60 * 60 * 1000);
    await refreshToken();

    setInterval(async () => {
        currentTrackDetails = await updateSpotifySong();
    }, 5 * 1000);
    currentTrackDetails = await updateSpotifySong();

    if ((/^https?:\/\/(.*\.)?cominatyou\.com$/).test(req.headers.origin)) {
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    }

    res.json(currentTrackDetails);
}
