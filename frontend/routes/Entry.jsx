import React from 'react';
import { Redirect } from 'react-router';

import { checkAuth } from '@apis';

class Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };

    this.loginSpotifyAccount = this.loginSpotifyAccount.bind(this);
    this.authenticate = this.authenticate.bind(this);
  }

  componentDidMount() {
    this.authenticate();
  }

  async loginSpotifyAccount() {
    const scopes = ['user-read-private', 'playlist-modify-private'].join(' ');
    const clientId = process.env.SPOTIFY_API_CLIENT_ID;
    const spotifyURI = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(`http://localhost:8080/callback`)}`;
    window.open(spotifyURI, '_blank ', 'width=400,height=500');
  }

  async authenticate() {
    await checkAuth().then(() => {
      this.setState({
        ...this.state,
        isAuthenticated: true
      });
    }).catch(() => {
      console.log("CATCH!!!!!");
      // TODO put any message to notify users to re-login
    });
  }

  render() {
    window.addEventListener('storage', () => {
      this.authenticate();
    });

    if(this.state.isAuthenticated) {
      return <Redirect to="/home" />;
    }else{
      return (
        <div id="entry">
          <button onClick={this.loginSpotifyAccount}>Login</button>
        </div>
      );
    } 
  }
}

export default Entry;