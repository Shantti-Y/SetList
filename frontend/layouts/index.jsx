import React from 'react';
import { Container, Content } from 'rsuite';

import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container id="layout">
        <AppHeader />
        <Content>{this.props.children}</Content>
        <AppFooter />
      </Container>
    );
  }
}