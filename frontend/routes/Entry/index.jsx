import React from 'react';
import { Redirect } from 'react-router';
import { Responsive, Container, Header, Button, Icon, Grid, Segment, Image } from 'semantic-ui-react'

import { checkAuth } from '@apis';
import { hasAuthenticationData } from '@apis/authentication';

const MastheadSectionOnDesktop = props => {
  return(
      <Responsive as={Segment} inverted textAlign='center' attached
        minWidth={769}
        style={{
          padding: 0,
          minHeight: '400px',
          width: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}>
        <video autoPlay muted loop
          style={{
            filter: "opacity(40%)",
            minHeight: '100%',
            width: '100%',
            position: 'absolute',
            bottom: 0,
            left: 0,
            zIndex: 0
          }}>
          <source src={require('@assets/videos/masthead.mp4')} />
        </video>
        <div style={{
          position: "absolute",
          top: "120px",
          width: "100%",
          padding: "20px"
        }}>
          <Header as='h1' content='Do something' inverted
            style={{
              fontSize: '2em',
              fontWeight: 'normal',
              marginBottom: 0
            }}
          />
          <Header as='h2' content='during listening to music in Spotify' inverted
            style={{
              fontSize: '1.7em',
              fontWeight: 'normal'
            }}
          />
          <StartButtonForSpotifyUser text="Start" />
        </div>
      </Responsive>
  )
}

const MastheadSectionOnMobile = props => {
  return(
      <Responsive as={Segment} inverted textAlign='center' attached
        maxWidth={768}
        style={{
          padding: 0,
          height: '320px',
          width: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}>
        <Image
          src={require('@assets/images/mastheads/connected-plugged-earpud.jpg')}
          style={{
            filter: "opacity(40%)",
            minHeight: '100%',
            Width: '100%',
            position: 'absolute',
            top: 0,
            zIndex: 0,
            margin: '0 auto'
          }}
        />
        <div style={{
          position: "absolute",
          top: "50px",
          width: "100%",
          padding: "20px"
        }}>
          <Header as='h1' content='Do something' inverted
            style={{
              fontSize: '2em',
              fontWeight: 'normal',
              marginBottom: 0
            }}
          />
          <Header as='h2' content='during listening to music in Spotify' inverted
            style={{
              fontSize: '1.7em',
              fontWeight: 'normal'
            }}
          />
          <StartButtonForSpotifyUser text="Start" />
        </div>
      </Responsive>
  )
}

const UsecaseSection = () => {
  const useCases = [
    { name: 'Running', imagePath: require('@assets/images/useCases/for-running.jpg') },
    { name: 'Studying', imagePath: require('@assets/images/useCases/for-studying.jpg') },
    { name: 'Traveling', imagePath: require('@assets/images/useCases/for-traveling.jpg') },
    { name: 'Relaxing', imagePath: require('@assets/images/useCases/for-relaxing.jpg') }
  ]
  return (
    <Segment style={{ padding: '4em 0em' }} vertical>
      <Grid container verticalAlign='middle'>
        <Grid.Row>
          <Header
            as='h2'
            content='For the use of...'
            style={{
              fontSize: '2em',
              fontWeight: 'normal',
              marginBottom: 0,
            }}
          />
        </Grid.Row>
        <Grid.Row columns={4}>
          {useCases.map(useCase => {
            return (
              <Grid.Column floated="left" mobile={8} tablet={4} computer={4} largeScreen={4}>
                <Image src={useCase.imagePath} size='small' />
                <Header as='h3' content={useCase.name}/>
              </Grid.Column>
            );
          })}
        </Grid.Row>
      </Grid>
    </Segment>
  )
}

const StartButtonForSpotifyUser = props => {

  const loginSpotify = async () => {
    const scopes = ['user-read-private', 'playlist-modify-private'].join(' ');
    const clientId = process.env.SPOTIFY_API_CLIENT_ID;
    const spotifyURI = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(`http://localhost:8080/callback`)}`;
    window.open(spotifyURI, '_blank ', 'width=400,height=500');
  }

  return (
    <Button primary onClick={loginSpotify}>
      {props.text}
      <Icon name='right arrow' />
    </Button>
  )
}

const DescriptionSection = () => {
  const descriptions = [
    {
      header: 'Create Playlists in Insanely Fast Speed',
      imagePath: require('@assets/images/descriptions/using-spotify.jpg'),
      imagePosition: 'right',
      paragraph: `
        Setlify creates an playlist by using the power of Spotify. What you need is a disired duration of a playlist and any search words.
        Once you apply them, a new playlist is launched in 5 seconds.
      `
    },
    {
      header: 'Focus Your Work During Playing Music',
      imagePath: require('@assets/images/descriptions/listening-something.jpg'),
      imagePosition: 'left',
      paragraph: `
        Mostly these playlists created by Setlify aren't used for just listening to. They are helpful for completing whatever you do.
        At the same time when a playlist is finished, your work is done.
      `
    },
  ]
  return(
    <Segment style={{ padding: '3em 0em' }} vertical>
      <Grid container stackable verticalAlign='middle'>
          {descriptions.map(description => {
            return (
              <Grid.Row>
                <Grid.Column width={8}>
                  <Header as='h3' style={{ fontSize: '2em' }}>
                    {description.header}
                  </Header>
                  <p style={{ fontSize: '1.33em' }}>{description.paragraph}</p>
                </Grid.Column>
                <Grid.Column floated='left' width={8}>
                  <Image size='large' src={description.imagePath} />
                </Grid.Column>
              </Grid.Row>
            )
          })}
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <StartButtonForSpotifyUser text="So Let's Get Startted!" />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
}

class Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };

    this.authenticate = this.authenticate.bind(this);
  }

  async componentDidMount() {
    await this.authenticate();
  }

  async authenticate() {
    await checkAuth()
      .then(() => {
        this.setState({
          ...this.state,
          isAuthenticated: true
        });
      })
      .catch(() => {
        console.log("CATCH!!!!!");
        this.setState({
          ...this.state,
          isAuthenticated: false
        });
        // TODO put any message to notify users to re-login
      });
  }

  render() {
    window.addEventListener('storage', async () => {
      if(hasAuthenticationData()){
        await this.authenticate();
      }
    });

    if(this.state.isAuthenticated){
      return <Redirect to="/home" />;
    }else{
      return (
        <div id="entry">
          <MastheadSectionOnDesktop />
          <MastheadSectionOnMobile />
          <DescriptionSection />
          <UsecaseSection />
        </div>
      );
    }    
  }
}

export default Entry;