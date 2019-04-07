const axios = require('axios');
const { getSpotifyClient } = require('./spotifyClient');
const { rootUrl } = require('./env')

module.exports = {
  judgeAuthenticated(authenticateData) {
    const client = getSpotifyClient(authenticateData);
    return !client.isExpired();
  },
  
  async postFetchingAuthorizationToken(grantType, code) {
    const clientId = process.env.SPOTIFY_API_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_API_CLIENT_SECRET;
    const params = grantType === 'authorization_code' ? {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: `${rootUrl}/callback`
    } : {
        grant_type: 'client_credentials'
      };
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
    }).catch(error => {
      console.log(error)
    });
    return data;
  }
};

