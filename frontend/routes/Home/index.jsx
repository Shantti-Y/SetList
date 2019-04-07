import React from 'react';
import moment from 'moment';
import { Redirect } from 'react-router';
import {
  Container,
  Transition,
  Loader,
  Button,
  Input,
  Grid,
  Segment,
  Icon,
  Form
} from 'semantic-ui-react';

import { createPlaylist } from '@apis';

const SpotifyEmbedPlayer = props => {
  const getSumDuration = () => {
    if (props.playlistInfo.tracks.length === 0) {
      return 0;
    }
    const totalDuration = moment.duration(props.playlistInfo.tracks.map(track => track.duration_ms).reduce((total, duration) => {
      return total + duration;
    }));
    return `${totalDuration.hours()} : ${totalDuration.minutes()} : ${totalDuration.seconds()}`;
  };

  const URIForSpotifyEmbededPlayer = () => {
    return `https://open.spotify.com/embed/user/${props.playlistInfo.userId}/playlist/${props.playlistInfo.playlistId}`;
  };
  return (
    <iframe
      src={URIForSpotifyEmbededPlayer()}
      width="100%"
      height="380"
      frameBorder="0"
      allowtransparency="true"
      allow="encrypted-media"></iframe>
  );
}

const InputField = props => {
  const handleChange = e => {
    props.onValueChange(e.target.value);
  }
  return (
    <Form.Field>
      <label>{props.labelName}</label>
      <Input
        iconPosition='left'
        placeholder={props.labelName}
        type={props.type}
        onChange={e => handleChange(e)}
        value={props.value}
      >
        <Icon name={props.iconName} />
        <input />
      </Input>
    </Form.Field>
  )
}

const PlaylistFormfield = props => {
  const formStructure = {
    duration: {
      label: 'Duration',
      key: 'duration',
      icon: 'clock outline',
      type: 'number'
    },
    queryWord: {
      label: 'Search',
      key: 'queryWord',
      icon: 'search',
      type: 'text'
    }
  }
  return (
    <Form>
      <InputField
        labelName={formStructure.duration.label}
        iconName={formStructure.duration.icon}
        type={formStructure.duration.type}
        onValueChange={value => props.onValueChange(formStructure.duration.key, value)}
        value={props.formValues.duration}
      />

      <InputField
        labelName={formStructure.queryWord.label}
        iconName={formStructure.queryWord.icon}
        type={formStructure.queryWord.type}
        onValueChange={value => props.onValueChange(formStructure.queryWord.key, value)}
        value={props.formValues.queryWord}
      />
      <Form.Field>
        <Button
          color="linkedin"
          onClick={props.onValueSubmitted}
          icon labelPosition="right"
          type="button"
        >
          Create Playlist<Icon name='play' />
        </Button>
      </Form.Field>
    </Form>
  )
}

const MainActionWithoutPlaylistInfo = props => {
  return (
    <Container>
      <Grid textAlign="center">
        <Grid.Row>
          <Grid.Column mobile={0} tablet={3} computer={3} largeScreen={3} />
          <Grid.Column mobile={16} tablet={10} computer={10} largeScreen={10}>
            <PlaylistFormfield
              formValues={props.formValues}
              onValueChange={(name, value) => props.onValueChange(name, value)}
              onValueSubmitted={props.onValueSubmitted}
            />
          </Grid.Column>
          <Grid.Column mobile={0} tablet={3} computer={3} largeScreen={3} />
        </Grid.Row>
      </Grid>
    </Container>
  )
}

const MainActionWithPlaylistInfo = props => {
  return (
    <Container>
      <Grid stackable textAlign="center">
        <Grid.Row>
          <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={8}>
            <PlaylistFormfield
              formValues={props.formValues}
              onValueChange={(name, value) => props.onValueChange(name, value)}
              onValueSubmitted={props.onValueSubmitted}
            />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={8}>
            <SpotifyEmbedPlayer playlistInfo={props.playlistInfo} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

const MainActionContainer = props => {
  if (props.playlistInfo.playlistId && props.playlistInfo.userId){
    return (
      <MainActionWithPlaylistInfo
        formValues={props.formValues}
        playlistInfo={props.playlistInfo}
        onValueChange={(name, value) => props.onValueChange(name, value)}
        onValueSubmitted={() => props.onValueSubmitted()}
      />
    )
  }else{
    return (
      <MainActionWithoutPlaylistInfo
        formValues={props.formValues}
        onValueChange={(name, value) => props.onValueChange(name, value)}
        onValueSubmitted={() => props.onValueSubmitted()}
      />
    )
  }
}

class LoaderScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      percentage: 0
    }
  }

  componentDidMount() {
    this.timer;
  }

  componentDidUpdate(){
    if(this.state.percentage === 100){
      this.props.onCompleteLoading();
      clearTimeout(this.timer);
      this.setState({
        ...this.state,
        percentage: 0
      })
    }

    if(this.props.isLoading){
      this.timer = setTimeout(() => {
        this.setState({
          ...this.state,
          percentage: this.state.percentage + 1
        })
      }, 200);
    }
  }

  render(){
    return (
      <Transition visible={this.props.isLoading} animation='fade up' duration={400}>
        <Loader active inline="centered" indeterminate>{this.state.percentage}%</Loader>
      </Transition>
    )
  } 
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        duration: '',
        queryWord: ''
      },
      playlistInfo: {
        playlistId: undefined,
        userId: undefined,
        tracks: []
      },
      isAuthenticated: true,
      errorMessage: undefined,
      errorMessageVisible: false,
      isFetching: false
    };
    this.handleMessageBox = this.handleMessageBox.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitPlaylistCondition = this.submitPlaylistCondition.bind(this);
    this.handleFinishingFetching = this.handleFinishingFetching.bind(this);
  }

  handleMessageBox(status){
    this.setState({
      ...this.state,
      errorMessageVisible: status
    })
  }

  handleChange(name, value) {
    const newFormValues = this.state.formValues
    newFormValues[name] = value
    this.setState({
      ...this.state,
      formValues: newFormValues
    });
  }

  async submitPlaylistCondition() {
    const getPlaylistIdInLocalStorage = () => {
      return window.localStorage.getItem('playlist_id') || '';
    };
    this.setState({
      ...this.state,
      playlistInfo: {},
      isFetching: true
    });
    
    await createPlaylist(this.state.formValues, getPlaylistIdInLocalStorage())
      .then(response => {
        const { data } = response;
        this.setState({
          ...this.state,
          playlistInfo: {
            playlistId: data.playlist.id,
            userId: data.playlist.owner.id,
            tracks: data.playlist.tracks.items
          }
        });
        window.localStorage.setItem('playlist_id', this.state.playlistInfo.playlistId);
      })
      .catch(error => {
        if(error.response.status === 401){
          this.setState({
            ...this.state,
            isAuthenticated: false,
            isFetching: false
          });
        }else{
          const message = error.response.data.message
          this.setState({
            ...this.state,
            errorMessage: message,
            errorMessageVisible: true,
            isFetching: false
          });
        }
      });
  }

  handleFinishingFetching(){
    this.setState({
      ...this.state,
      isFetching: false
    });
  }

  render() {
    if (this.state.isAuthenticated) {
      return (
        <div id="home">
          <div className="segment-wrapper" style={{ 'min-height': '390px' }}>
            <Segment vertical style={{ padding: '3em 0em' }}>
              {(() => {
                if(!this.state.isFetching){
                  return (
                    <MainActionContainer
                      formValues={this.state.formValues}
                      playlistInfo={this.state.playlistInfo}
                      onValueChange={(name, value) => this.handleChange(name, value)}
                      onValueSubmitted={() => this.submitPlaylistCondition()}
                    />
                  )
                }
              })()}
              <LoaderScreen
                isLoading={this.state.isFetching}
                onCompleteLoading={() => this.handleFinishingFetching()}
              />
            </Segment>
          </div>
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

export default Home;