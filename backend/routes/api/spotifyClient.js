const axios = require('axios');
const moment = require('moment');

class SpotifyClientSingleton {
  constructor(expiredDuration, tokenType, accessToken) {
    this.expiredTime = moment().seconds(expiredDuration);
    this.requestConfiguration = axios.create({
      baseURL: 'https://api.spotify.com/v1',
      timeout: 4000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `${tokenType} ${accessToken}`
      }
    });
  }

  isExpired() {
    return moment() >= this.expiredTime
  }
}
let spotifyClient;

const getSpotifyClient = async (grantType, code = '') => {
  if (spotifyClient === undefined || spotifyClient.isExpired()) {
    await postFetchingAuthorizationToken(grantType, code);
  }
  return spotifyClient
}

const postFetchingAuthorizationToken = async (grantType, code) => {
  const clientId = process.env.SPOTIFY_API_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_API_CLIENT_SECRET;
  const params = grantType === 'authorization_code' ? {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: 'http://localhost:8080/api/start_playlist'
  } : {
    grant_type: 'client_credentials'
  }
  const { data } = await axios({
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    timeout: 4000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    params: params,
    auth: {
      username: clientId,
      password: clientSecret
    }
  });
  spotifyClient = new SpotifyClientSingleton(
    data.expires_in, data.token_type, data.access_token);
}

module.exports = { getSpotifyClient };