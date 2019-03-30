const axios = require('axios');
const moment = require('moment');

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
    });
    return data.tracks.items
  }

  async getCurrentUserProfile() {
    const { data } = await this.request.get('/me');
    return data
  }

  async postCreatingNewPlaylist(userId, playlistName, playlistDescription) {
    const { data } = await this.request.post(`/users/${userId}/playlists`, {
      name: playlistName,
      description: playlistDescription,
      public: false
    });
    return data
  }

  async getPlaylist(playlistId) {
    const { data } = await this.request.get(`/playlists/${playlistId}`)
      .catch(error => {
        return { data: undefined }
      });
    return data
  }

  async postAddingTracksToPlaylist(playlistId, trackIds) {
    const trackURIs = trackIds.map(trackId => `spotify:track:${trackId}`);
    await this.request.post(`/playlists/${playlistId}/tracks`, {
      uris: trackURIs,
      position: 0
    });
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
    });
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