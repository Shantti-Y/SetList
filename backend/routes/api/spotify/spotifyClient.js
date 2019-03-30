const axios = require('axios');
const moment = require('moment');

class SpotifyClient {
  constructor(accessToken, tokenType, expiredAt) {
    this.expiresAt = moment(expiredAt, 'x');
    this.request = axios.create({
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
    const nowTime = moment(moment().format('x'))
    return nowTime >= this.expiresAt
  }
}

const getSpotifyClient = authenticateData => {
  return new SpotifyClient(
    authenticateData.accessToken,
    authenticateData.tokenType,
    authenticateData.expiresAt
  )
}

const judgeAuthenticated = authenticateData => {
  const client = getSpotifyClient(authenticateData)
  return !client.isExpired();
}

const postFetchingAuthorizationToken = async (grantType, code) => {
  const clientId = process.env.SPOTIFY_API_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_API_CLIENT_SECRET;
  const params = grantType === 'authorization_code' ? {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: 'http://localhost:8080/callback'
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
  return data
}

module.exports = { getSpotifyClient, postFetchingAuthorizationToken, judgeAuthenticated };