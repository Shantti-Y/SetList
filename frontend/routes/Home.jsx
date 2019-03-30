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
      playlistId: undefined,
      userId: undefined
    }
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
    const { data } = await createPlaylist(this.state.formValues);
    console.log(data)
    this.setState({
      ...this.state,
      playlistId: data.playlistId,
      userId: data.userId
    });
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

    const URIForSpotifyEmbededPlayer = () => {
      if(this.state.playlistId && this.state.userId){
        return `https://open.spotify.com/embed/user/${this.state.userId}/playlist/${this.state.playlistId}`;
      }else{
        return undefined
      }
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
        </div>
        <div>
          {(() => {
            if (URIForSpotifyEmbededPlayer()) {
              return <iframe src={URIForSpotifyEmbededPlayer()} width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            }
          })()}
          
        </div>
      </div>
    )
  }
}

export default Home;