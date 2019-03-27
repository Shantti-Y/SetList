const axios = require('axios');
const moment = require('moment');

const { getSpotifyClient } = require('./spotifyClient');

module.exports = {
  getTracksBySearch: async (queryWord, pageIdx) => {
    const client = await getSpotifyClient('client_credentials');
    const offset = pageIdx * 50;
    const { data } = await client.requestConfiguration.get(`/search`, {
      params: {
        q: queryWord,
        type: 'track',
        limit: 50,
        offset: offset
      }
    });
     return data.tracks.items
  },
  // TODO spotifyAPI singleton variable must be used by its parent client.
  getUserDevices: async (code) => {
    const client = await getSpotifyClient('authorization_code', code);
    const { data } = await client.requestConfiguration.get('/me/player/devices');
    
    return data.devices;
  },

  putStartingUserPlayback: async (code, deviceId, playlistId) => {
    // TODO: play (or resume) the newly created playlist at the beginning.
    const contextUri = `spotify:user:spotify:playlist:${playlistId}`;
    const client = await getSpotifyClient('authorization_code', code);
    await client.requestConfiguration.put('/me/player/play', {
      params: {
        device_id: deviceId
      },
      data: {
        context_uri: contextUri
      }
    });
  },

  getCurrentUserProfile: async code => {
    const client = await getSpotifyClient('authorization_code', code);
    const { data } = await client.requestConfiguration.get('/me');
    return data
  },

  // unfinished
  postCreatingPlaylist: async (code, userId) => {
    const client = await getSpotifyClient('authorization_code', code);
    const { data } = await client.requestConfiguration.post(`/users/${userId}/playlists`, {
      name: 'sample playlist',
      description: 'This is sample playlist',
      public: false
    });
    return data
  },

  postAddingTracksToPlaylist: async (code, playlistId, trackIds) => {
    const trackURIs = trackIds.map(trackId => `spotify:track:${trackId}`);
    const client = await getSpotifyClient('authorization_code', code);
    const { data } = await client.requestConfiguration.post(`/playlists/${playlistId}/tracks`, {
      uris: trackURIs,
      position: 0
    });
    return true
  }
}
