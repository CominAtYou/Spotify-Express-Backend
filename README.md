# Spotify-Express-Backend
An express app that gets the currently playing song from a Spotify access token, and returns it as JSON.

## Running Yourself
You'll need a Spotify API refresh token for the account you wish to run this for. To get one, create a Spotify API application and obtain access with [authorization code flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow). You can make up whatever redirect URI you want, it won't matter as long as it uses HTTP.

Once you authorize, copy the access code from the 'code' parameter in the URL. Once you've done that, use your newly acquired code to [request a refresh token](https://developer.spotify.com/documentation/general/guides/authorization-guide/#2-have-your-application-request-refresh-and-access-tokens-spotify-returns-access-and-refresh-tokens).

Once you've done that, create a file called `config.json` in the project root. In there, add:
```
{
  "refresh_token": "your_refresh_token",
  "client_id": "your_app_client_id",
  "client_secret": "your_app_client_secret"
}
```

Once you've done that, compile the TypeScript and run. You should be all set.
  
