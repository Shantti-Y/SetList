const axios = require('axios');
const moment = require('moment');

const { getSpotifyClient } = require('./spotifyClient');

module.exports = {
  async getTracksBySearch(authenticationCode, queryWord, pageIdx) {
    const client = getSpotifyClient(authenticationCode);
    const offset = pageIdx * 50;
    const { data } = await client.request.get(`/search`, {
      params: {
        q: queryWord,
        type: 'track',
        limit: 50,
        offset: offset
      }
    });
    return data.tracks.items
  },

  async getCurrentUserProfile(authenticationCode) {
    const client = getSpotifyClient(authenticationCode);

    const { data } = await client.request.get('/me');
    return data
  },

  async postCreatingNewPlaylist(authenticationCode, userId, playlistName, playlistDescription) {
    const client = getSpotifyClient(authenticationCode);
    const { data } = await client.request.post(`/users/${userId}/playlists`, {
      name: playlistName,
      description: playlistDescription,
      public: false
    });
    return data
  },

  async getPlaylist(authenticationCode, playlistId) {
    const client = getSpotifyClient(authenticationCode);

    const { data } = await client.request.post(`/playlists/${playlistId}`);
    return data
  },

  async postAddingTracksToPlaylist(authenticationCode, playlistId, trackIds) {
    const client = getSpotifyClient(authenticationCode);

    const trackURIs = trackIds.map(trackId => `spotify:track:${trackId}`);
    await client.request.post(`/playlists/${playlistId}/tracks`, {
      uris: trackURIs,
      position: 0
    });
    return true
  },

  async deleteRemovingTracksFromPlaylist(authenticationCode, playlistId, trackIds) {
    const client = getSpotifyClient(authenticationCode);

    const trackObjects = trackIds.map(trackId => {
      return { uri: `spotify:track:${trackId}` }
    });
    const { data } = await client.request.delete(`/playlists/${playlistId}/tracks`, {
      tracks: trackObjects
    });
    return data
  },
  // TODO spotifyAPI singleton variable must be used by its parent client.
  async getUserDevices(authenticationCode) {
    const client = getSpotifyClient(authenticationCode);

    const { data } = await client.request.get('/me/player/devices');

    return data.devices;
  },

  async putStartingUserPlayback(authenticationCode, deviceId, playlistId) {
    const client = getSpotifyClient(authenticationCode);

    // TODO: play (or resume) the newly created playlist at the beginning.
    const contextUri = `spotify:user:spotify:playlist:${playlistId}`;
    await client.request.put('/me/player/play', {
      params: {
        device_id: deviceId
      },
      context_uri: contextUri
    });
  }
}
