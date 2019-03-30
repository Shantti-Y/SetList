const axios = require('axios');
const moment = require('moment');
const { errorContexts, transmitErrorContext } = require('./errorContexts');

class SpotifyClient {
  constructor(accessToken, tokenType, expiresAt) {
    this.expiresAt = moment(expiresAt, 'x');
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
    if(this.expiresAt === undefined){
      return true
    }
    const nowTime = moment(moment().format('x'))
    return nowTime >= this.expiresAt
  }

  async getTracksBySearch(queryWord, pageIdx) {
    const offset = pageIdx * 50;
    const { data } = await this.request.get(`/search`, {
      params: {
        q: queryWord,
        type: 'track',
        limit: 50,
        offset: offset
      }
    }).catch(error => {
      const status = error.response.status;
      if(status === 404){
        return {
          data: { tracks: { items: [] } }
        }
      }else{
        transmitErrorContext(status);
      }
    });
    return data.tracks.items
  }

  async getCurrentUserProfile() {
    const { data } = await this.request.get('/me')
      .catch(error => transmitErrorContext(error.response.status));
    return data
  }

  async postCreatingNewPlaylist(userId, playlistName, playlistDescription) {
    const { data } = await this.request.post(`/users/${userId}/playlists`, {
      name: playlistName,
      description: playlistDescription,
      public: false
    }).catch(error => transmitErrorContext(error.response.status));
    return data
  }

  async getPlaylist(playlistId) {
    const { data } = await this.request.get(`/playlists/${playlistId}`)
      .catch(error => {
        const status = error.response.status;
        // TODO: Check if there's another status to handle like this.
        if(status === 404){
          return { data: undefined }
        }else{
          transmitErrorContext(status)
        }
      });
    return data
  }

  async postAddingTracksToPlaylist(playlistId, trackIds) {
    const trackURIs = trackIds.map(trackId => `spotify:track:${trackId}`);
    await this.request.post(`/playlists/${playlistId}/tracks`, {
      uris: trackURIs,
      position: 0
    }).catch(error => transmitErrorContext(error.response.status));
    return true
  }

  async deleteRemovingTracksFromPlaylist(playlistId, trackIds) {
    const trackObjects = trackIds.map(trackId => {
      return { uri: `spotify:track:${trackId}` }
    });
    const { data } = await this.request.delete(`/playlists/${playlistId}/tracks`, {
      data: {
        tracks: trackObjects
      }
    }).catch(error => transmitErrorContext(error.response.status));
    return data
  }
}



const getSpotifyClient = authenticateData => {
  return new SpotifyClient(
    authenticateData.accessToken,
    authenticateData.tokenType,
    authenticateData.expiresAt
  )
}

module.exports = { getSpotifyClient };