import React from 'react';
import { Redirect } from 'react-router';
import { Responsive, Container, Header, Button, Icon, Grid, Segment, Image } from 'semantic-ui-react'

import { checkAuth } from '@apis';
import { hasAuthenticationData } from '@apis/authentication';

// TODO Organize Design
const ResponsiveHeaderOnDesktop = props => {
  return(
    <Responsive getWidth={() => window.innerWidth} minWidth={768}>
      <Container text>
        <Header
          as='h1'
          content='Imagine-a-Company'
          inverted
          style={{
            fontSize: '2em',
            fontWeight: 'normal',
            marginBottom: 0,
          }}
        />
        <Header
          as='h2'
          content='Do whatever you want when you want to.'
          inverted
          style={{
            fontSize: '1.7em',
            fontWeight: 'normal',
          }}
        />
        <Button primary onClick={props.onLogin}>
          Login
          <Icon name='right arrow' />
        </Button>
      </Container>
    </Responsive>
  )
}

const DescriptionSection = () => {
  return(
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Grid container stackable verticalAlign='middle'>
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              We Help Companies and Companions
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              We can give your company superpowers to do things that they never thought possible.
              Let us delight your customers and empower your needs... through pure data analytics.
            </p>
            <Header as='h3' style={{ fontSize: '2em' }}>
              We Make Bananas That Can Dance
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              Yes that's right, you thought it was the stuff of dreams, but even bananas can be
              bioengineered.
            </p>
          </Grid.Column>
          <Grid.Column floated='right' width={6}>
            <Image bordered rounded size='large' src='/images/wireframe/white-image.png' />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <Button size='huge'>Check Them Out</Button>
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

    this.loginSpotifyAccount = this.loginSpotifyAccount.bind(this);
    this.authenticate = this.authenticate.bind(this);
  }

  async componentDidMount() {
    await this.authenticate();
  }

  async loginSpotifyAccount() {
    const scopes = ['user-read-private', 'playlist-modify-private'].join(' ');
    const clientId = process.env.SPOTIFY_API_CLIENT_ID;
    const spotifyURI = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(`http://localhost:8080/callback`)}`;
    window.open(spotifyURI, '_blank ', 'width=400,height=500');
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
          <Segment
            inverted
            textAlign='center'
            vertical
          >
            <ResponsiveHeaderOnDesktop onLogin={this.loginSpotifyAccount} />
          </Segment>
          <DescriptionSection />
        </div>
      );
    }    
  }
}

export default Entry;