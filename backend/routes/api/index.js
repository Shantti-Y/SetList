const express = require('express');
const moment = require('moment');
const apiRouter = express.Router();
const path = require('path');

const callbackURI = 'http://localhost:8080/callback';

const {
  getTracksBySearch,
  getUserDevices,
  putStartingUserPlayback,
  getCurrentUserProfile,
  postCreatingPlaylist,
  postAddingTracksToPlaylist
} = require('./spotifyAPIs');

apiRouter.get('/initialize_playlist', async (req, res) => {
  const isSumDurationLessThanMaximum = (tracks, targetDuration) => {
    const getSumDuration = (total, duration) => {
      return total + duration;
    }
    if (tracks.length === 0) {
      return false;
    }
    const currentTotalTracksDuration = tracks.map(track => track.duration_ms).reduce(getSumDuration);
    return targetDuration - currentTotalTracksDuration <= 0;
  }
  const targetDuration = req.query.duration * 60 * 1000;
  const targetWord = req.query.queryWord
  
  const responseTracks = [];
  let pageIdx = 0;

  while (true) {
    // Get tracks from invoking Spotify API
    const responseFromSpotifyAPI = await getTracksBySearch(targetWord, pageIdx);
    // If response has no track, an execution must be stopped and return a response along with error status code.
    if (responseFromSpotifyAPI.length === 0) {
      res.status(404).send({ error: {
        status: 404,
        message: `Couldn't create playlist due to lack of tracks.`
      }});
      break;
    }
    const fetchedTracksFromSpotify = responseFromSpotifyAPI
    // [0m30s, 1m00s, 1m30s...10m00s]
    const playDurations = new Array(20).fill(1).map((_, idx) => (idx + 1) * 30 * 1000);
    while (playDurations.length > 0 || fetchedTracksFromSpotify.length > 0) {
      // Randomly pick up a specific duration.
      const selectedPlayDurationIdx = Math.floor(Math.random() * playDurations.length);
      // Pick up a track which has the duration that is between the random specified duration ± 15 seconds.
      const selectedTrackIdx = fetchedTracksFromSpotify.findIndex(track => {
        return track.duration_ms >= playDurations[selectedPlayDurationIdx] - (15 * 1000) &&
          track.duration_ms <= playDurations[selectedPlayDurationIdx] + (15 * 1000)
      });
      if (selectedTrackIdx >= 0) {
        // If fetched tracks has it which owns tolerant duration, the track is selected, inserted to actual response.
        responseTracks.push(fetchedTracksFromSpotify[selectedTrackIdx]);
        fetchedTracksFromSpotify.splice(selectedTrackIdx, 1);
      } else {
        playDurations.splice(selectedPlayDurationIdx, 1);
      }
      if (isSumDurationLessThanMaximum(responseTracks, targetDuration)) {
        // Response data
        const responseData = {
          tracks: responseTracks,
          created_at: moment(),
          query_word: targetWord
        }
        res.status(200).send(responseData);
        return;
      }
    }
    pageIdx += 1;
  }
});

const callbackHtmlFile = path.resolve(__dirname, '../../callback.html');
apiRouter.get('/start_playlist', async (req, res) => {
  if (req.query.code !== undefined){
    const trackIds = req.query.state.split(',')
    const authorizationCode = req.query.code;
    const userProfile = await getCurrentUserProfile(authorizationCode);
    const playListDetail = await postCreatingPlaylist(authorizationCode, userProfile.id);
    const devices = await getUserDevices(authorizationCode);
    await postAddingTracksToPlaylist(authorizationCode, playListDetail.id, trackIds);
    await putStartingUserPlayback(authorizationCode, devices[0], playListDetail.id);
    res.redirect(callbackURI);
  }else{
    res.status(404).send({
      error: {
        status: 404,
        message: `Couldn't create playlist due to lack of tracks.`
      }
    });
  }
})

module.exports = apiRouter; 