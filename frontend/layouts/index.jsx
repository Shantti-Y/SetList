import React from 'react';

import { Sidebar, Segment } from 'semantic-ui-react'
import './style.scss';

import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import AppSidebar from './AppSidebar';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenubarOpened: false
    }

    this.changeMenubarOpened = this.changeMenubarOpened.bind(this);
  }

  changeMenubarOpened(status){
    this.setState({
      ...this.state,
      isMenubarOpened: status
    });
  }

  render() {
    return (
      <div id="layout">
        <Sidebar.Pushable>
          <AppSidebar
            isOpened={this.state.isMenubarOpened}
            onCloseMenubar={() => this.changeMenubarOpened(false)}
          />

          <Sidebar.Pusher dimmed={this.state.isMenubarOpened}>
            <AppHeader
              onOpenMenubar={() => this.changeMenubarOpened(true)}
            />
              <main>{this.props.children}</main>
            <AppFooter />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}