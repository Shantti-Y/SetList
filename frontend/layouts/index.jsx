import React from 'react';

import { Sidebar, Segment } from 'semantic-ui-react'
import './style.scss';

import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="layout">
        <AppHeader />
          <main>{this.props.children}</main>
        <AppFooter />
      </div>
    );
  }
}