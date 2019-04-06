import React from 'react';
import { Menu, Segment, Icon, Divider, Header } from 'semantic-ui-react';

const Section = props => {
  return (
    <div style={{ padding: '6em 0em', maxWidth: '460px', margin: '0 auto' }}>
      {props.children}
    </div>
  )
}

class About extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id="about">
        <Section>
          <Header as='h3' content='What is this?' style={{ fontSize: '2em' }} />
          <p>Setlify is an instant playlist generator which can be played in Spotify or this site.</p>
          <p>Its mission is to make any users able to complete their tasks in time such as </p>
          <ul>
            <li>Jogging</li>
            <li>Studying</li>
            <li>Working</li>
            <li>Traveling</li>
            <li>...and more!</li>
          </ul>
        </Section>
        <Divider section />
        <Section>
          <Header as='h3' content='How to use' style={{ fontSize: '2em' }} />
          <p>What you need is your Spotify Account, the desired total duration of a playlist, and your favorite words for searching for tracks that you like.</p>
          <ol>
            <li>Log in with your Spotify Account</li>
            <li>Fill forms with duration and words for searching for tracks.</li>
            <li>...and that's it!</li>
          </ol>
        </Section>
        <Divider section />
        <Section>
          <Header as='h3' content='About an author' style={{ fontSize: '2em' }} />
          <Header as='h4' content='Name: Takahiro Yoshioka (ShanttiY)' style={{ fontSize: '2em' }} />
          <p>
            I'm a Japanese full-stack developer and strongly interested to effective UI/IX design for great user experience.
          </p>
          <p>
            I have been working at a company in Japan which operates some websites that provide medical information.
          </p>
        </Section>
      </div>
    )
  }
}

export default About;