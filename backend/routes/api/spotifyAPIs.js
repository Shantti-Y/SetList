const axios = require('axios');
const moment = require('moment');

const getSpotifyClient = require('./spotifyClient');

module.exports = {
  getTracksBySearch: async (queryWord, pageIdx) => {
    const client = await getSpotifyClient();
    const offset = pageIdx * 50;
    const { data } = await client.requestConfiguration.get(`/search`, {
      params: {
        q: queryWord,
        type: 'track',
        limit: 50,
        offset: offset,
        include_external: 'audio'
      }
    });
     return data.tracks.items
  }
}
