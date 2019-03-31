import React from 'react';
import moment from 'moment';
import { Redirect } from 'react-router';
import { Grid, Row, Col, InputGroup, Icon, Input, Button } from 'rsuite/lib';

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
      },
      isAuthenticated: true,
      errorMessage: undefined
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitPlaylistCondition = this.submitPlaylistCondition.bind(this);
  }

  handleChange(name, value) {
    this.setState({
      ...this.state,
      formValues: {
        ...this.state.formValues,
        [name]: value
      }
    });
  }

  async submitPlaylistCondition() {
    const getPlaylistIdInLocalStorage = () => {
      return window.localStorage.getItem('playlist_id') || '';
    };

    await createPlaylist(this.state.formValues, getPlaylistIdInLocalStorage())
      .then(response => {
        const { data } = response;
        this.setState({
          ...this.state,
          playListInfo: {
            playlistId: data.playlist.id,
            userId: data.playlist.owner.id,
            tracks: data.playlist.tracks.item
          }
        });
        window.localStorage.setItem('playlist_id', this.state.playListInfo.playlistId);
      })
      .catch(error => {
        if(error.response.status === 401){
          this.setState({
            ...this.state,
            isAuthenticated: false
          });
        }else{
          const message = error.response.data.message
          this.setState({
            ...this.state,
            errorMessage: message
          });
        }
      });
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

    if (this.state.isAuthenticated) {
      return (
        <div>
          <Grid fluid>
            <Row>
              <Col xs={24}><p>{this.state.errorMessage}</p></Col>
            </Row>
            <Row>
              <Col xs={4} sm={8}></Col>
              <Col xs={16} sm={8}>
                <InputGroup inside>
                  <InputGroup.Addon>
                    <Icon size="lg" icon="clock-o" />
                  </InputGroup.Addon>
                  <Input
                    size="lg"
                    type="number"
                    value={this.state.formValues.duration}
                    onChange={value => this.handleChange('duration', value)}
                  ></Input>
                </InputGroup>
                <InputGroup inside>
                  <InputGroup.Addon>
                    <Icon size="lg" icon="search" />
                  </InputGroup.Addon>
                  <Input
                    size="lg"
                    type="text"
                    value={this.state.formValues.queryWord}
                    onChange={value => this.handleChange('queryWord', value)}
                  />
                </InputGroup>
                <Button appearance="primary" onClick={this.submitPlaylistCondition}>Create Playlist</Button>
              </Col>
              <Col xs={4} sm={8}></Col>
            </Row>
            <Row>
              <Col xs={24}>
                {(() => {
                  if (URIForSpotifyEmbededPlayer()) {
                    return <iframe src={URIForSpotifyEmbededPlayer()} width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>;
                  }
                })()}
              </Col>
            </Row>
          </Grid>
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

export default Home;