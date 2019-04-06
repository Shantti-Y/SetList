const express = require('express');
const apiRouter = express.Router();
const { judgeAuthenticated } = require('../utils/authentication');
const { getSpotifyClient } = require('../utils/spotifyClient');
const { transmitErrorContext } = require('../utils/errorContexts');

const localStorageToAuthenticateData = localStorageData => {
  return {
    accessToken: localStorageData.access_token,
    tokenType: localStorageData.token_type,
    expiresAt: localStorageData.expires_at
  };
};

apiRouter.post('/check_auth', (req, res) => {
  try {
    const authenticationCode = localStorageToAuthenticateData(req.body);
    if (judgeAuthenticated(authenticationCode)) {
      res.status(200).send();
    } else {
      transmitErrorContext(401);
    }
  } catch(error) {
    res.status(error.status).json(error);
  }
});

apiRouter.post('/initialize_playlist', async (req, res) => {
  try {
    const authenticationCode = localStorageToAuthenticateData(req.body.authentication);
    if (!judgeAuthenticated(authenticationCode)) {
      transmitErrorContext(401)
    }
    const spotifyClient = getSpotifyClient(authenticationCode);

    const localPlaylistId = req.body.playlist_id;
    const playlistName = `Your Today's Set List`;
    const playlistDescription = `A set list created by randomly selected a bunch of tracks which almost you like.`;

    const getTracksInSpecifiedDuration = async (targetWord, targetDuration) => {
      const isSumDurationLessThanMaximum = (tracks, targetDuration) => {
        const getSumDuration = (total, duration) => {
          return total + duration;
        };
        if (tracks.length === 0) {
          return false;
        }
        const currentTotalTracksDuration = tracks.map(track => track.duration_ms).reduce(getSumDuration);
        return targetDuration - currentTotalTracksDuration <= 0;
      };
      const responseTracks = [];
      let pageIdx = 0;

      while (true) {
        // Get tracks from invoking Spotify API
        const responseFromSpotifyAPI = await spotifyClient.getTracksBySearch(targetWord, pageIdx);
        // If response has no track, an execution must be stopped and return a response along with error status code.
        if (responseFromSpotifyAPI.length === 0) {
          transmitErrorContext(404);
        }
        const fetchedTracksFromSpotify = responseFromSpotifyAPI;
        // [0m30s, 1m00s, 1m30s...10m00s]
        const playDurations = new Array(20).fill(1).map((_, idx) => (idx + 1) * 30 * 1000);
        while (playDurations.length > 0 || fetchedTracksFromSpotify.length > 0) {
          // Randomly pick up a specific duration.
          const selectedPlayDurationIdx = Math.floor(Math.random() * playDurations.length);
          // Pick up a track which has the duration that is between the random specified duration ± 15 seconds.
          const selectedTrackIdx = fetchedTracksFromSpotify.findIndex(track => {
            return track.duration_ms >= playDurations[selectedPlayDurationIdx] - (15 * 1000) &&
              track.duration_ms <= playDurations[selectedPlayDurationIdx] + (15 * 1000);
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
            return responseTracks;
          }
        }
        pageIdx += 1;
      }
    };

    const editPlaylist = async (playlistId, tracks) => {
      const tracksForRemoval = await spotifyClient.getTracksOfPlaylist(playlistId)
      const playlistInfo = await spotifyClient.deleteRemovingTracksFromPlaylist(playlistId, tracksForRemoval.items.map(item => item.track.id));
      await spotifyClient.postAddingTracksToPlaylist(playlistId, tracks.map(track => track.id));
      return playlistInfo; 
    };

    const createPlaylist = async (userInfo, tracks) => {
      const playlistInfo = await spotifyClient.postCreatingNewPlaylist(userInfo.id, playlistName, playlistDescription);
      await spotifyClient.postAddingTracksToPlaylist(playlistInfo.id, tracks.map(track => track.id));
      return playlistInfo;
    };

    const tracks = await getTracksInSpecifiedDuration(req.body.condition.queryWord, (req.body.condition.duration * 60 * 1000));
    const userInfo = await spotifyClient.getCurrentUserProfile();
    const playlist = await spotifyClient.getPlaylist(localPlaylistId);
    let playlistInfo;
    if(playlist) {
      playlistInfo = playlist;
      await editPlaylist(playlist.id, tracks);
    }else{
      playlistInfo = await createPlaylist(userInfo, tracks);
    }
    res.status(201).json({
      data: { playlist: playlistInfo }
    });
  }catch(error) {
    res.status(error.status).json(error);
  }
});

module.exports = apiRouter; 