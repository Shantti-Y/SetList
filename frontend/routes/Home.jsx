import React from 'react';
import moment from 'moment';

import { createPlaylist } from '@apis';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        duration: 0,
        queryWord: ''
      },
      playListInfo: {
        playlistId: undefined,
        userId: undefined,
        tracks: []
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitPlaylistCondition = this.submitPlaylistCondition.bind(this);
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
    const getPlaylistIdInLocalStorage = () => {
      return window.localStorage.getItem('playlist_id') || '';
    };

    const { data } = await createPlaylist(this.state.formValues, getPlaylistIdInLocalStorage());
    this.setState({
      ...this.state,
      playListInfo: {
        playlistId: data.playlist.id,
        userId: data.playlist.owner.id,
        tracks: data.playlist.tracks.item
      }
    });
    window.localStorage.setItem('playlist_id', this.state.playListInfo.playlistId);

  }

  render() {
    const getSumDuration = () => {
      if (this.state.playlistInfo.tracks.length === 0) {
        return 0;
      }
      const totalDuration = moment.duration(this.state.playlistInfo.tracks.map(track => track.duration_ms).reduce((total, duration) => {
        return total + duration;
      }));
      return `${totalDuration.hours()} : ${totalDuration.minutes()} : ${totalDuration.seconds()}`;
    };

    const URIForSpotifyEmbededPlayer = () => {
      if(this.state.playListInfo.playlistId && this.state.playListInfo.userId) {
        return `https://open.spotify.com/embed/user/${this.state.playListInfo.userId}/playlist/${this.state.playListInfo.playlistId}`;
      }else{
        return undefined;
      }
    };

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
        </div>
        <div>
          {(() => {
            if (URIForSpotifyEmbededPlayer()) {
              return <iframe src={URIForSpotifyEmbededPlayer()} width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>;
            }
          })()}
          
        </div>
      </div>
    );
  }
}

export default Home;