import React from 'react';
import moment from 'moment';

import { createPlaylist } from '@apis/spotifyClient';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        duration: 0,
        queryWord: ''
      },
      playlistTracks: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.submitPlaylistCondition = this.submitPlaylistCondition.bind(this);
    this.loginSpotifyAccount = this.loginSpotifyAccount.bind(this);
  }

  handleChange(name, e) {
    this.setState({
      ...this.state,
      formValues: {
        ...this.state.formValues,
        [name]: e.target.value
      }
    });
  }

  async submitPlaylistCondition() {
    const newPlaylist = await createPlaylist(this.state.formValues);
    this.setState({
      ...this.state,
      playlistTracks: newPlaylist.tracks
    });
  }

  async loginSpotifyAccount() {
    const trackIds = this.state.playlistTracks.map(track => track.id).join(',')
    console.log(trackIds)
    const scopes = [
      'user-read-playback-state', 'user-modify-playback-state', 'user-read-private', 'playlist-modify-private'
    ].join(' ');
    const clientId = process.env.SPOTIFY_API_CLIENT_ID;
    const spotifyURI = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&state=${trackIds}&redirect_uri=${encodeURIComponent(`http://localhost:8080/api/start_playlist`)}`;
    window.open(spotifyURI, '_blank ', 'width=400,height=500')
  }

  render() {
    const getSumDuration = (tracks) => {
      if (tracks.length === 0) {
        return 0;
      }
      const totalDuration = moment.duration(tracks.map(track => track.duration_ms).reduce((total, duration) => {
        return total + duration;
      }));
      return `${totalDuration.hours()} : ${totalDuration.minutes()} : ${totalDuration.seconds()}`
    }

    return (
      <div>
        <div>
          <div>
            <label>Playing Time</label>
            <input
              type="number"
              value={this.state.formValues.duration}
              onChange={e => this.handleChange('duration', e)}
            />
          </div>
          <div>
            <label>Word</label>
            <input
              type="text"
              value={this.state.formValues.queryWord}
              onChange={e => this.handleChange('queryWord', e)}
            />
          </div>
          <button onClick={this.submitPlaylistCondition}>Create Playlist</button>

          <button onClick={this.loginSpotifyAccount}>Play a playlist</button>
        </div>
        <div>
          <ul>
            {this.state.playlistTracks.map((track) => {
              return (
                <li key={track.id}>
                  {track.name}
                </li>
              )
            })}
          </ul>
          <div>
            <p>Total duration: {getSumDuration(this.state.playlistTracks)}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;