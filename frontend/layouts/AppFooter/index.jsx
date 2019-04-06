import React from 'react';
import { Container, Header, List, Grid, Segment } from 'semantic-ui-react'

// TODO Organize Design
const AppFooter = () => {
  return (
    <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted>
          <Grid.Row >
            <Grid.Column width={6}>
              <Header as='h4' inverted> Visit Spotify</Header>
              <p>Setlify needs your Spotify Account. Unless you're not the user of it, please subscribe it to use Setlify's feature.</p>
              <a src="https://www.spotify.com/is" target="_blank">https://www.spotify.com/is</a>
            </Grid.Column>
            <Grid.Column width={6}>
              <Header as='h4' inverted>Spotify for Developers</Header>
              <p>Setlify mostly relies on Spotify Web API. If you're some kinds of a developer and interested in it, I recommend you to visit the following web site.</p>
              <a src="https://developer.spotify.com/documentation/web-api" target="_blank">https://developer.spotify.com/documentation/web-api</a>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column textAlign="center">
              <p>2019 © Takahiro Yoshioka / Shantti-Y</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  );
}

export default AppFooter;