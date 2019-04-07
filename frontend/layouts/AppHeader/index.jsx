import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Segment, Icon } from 'semantic-ui-react';

import './style.scss';

const AppHeader = props => {
  return (
    <Menu inverted attached style={{ padding: '0 1em' }}>
      <Link to="/" style={{ margin: '3px 0 0 11px' }}>
        <h1>Setlify</h1>
      </Link>
      <Menu.Menu position='right'>
        <Menu.Item postion="right">
          <Link to="/about"><Icon name="help circle" size="large" /></Link>
        </Menu.Item>
        <Menu.Item postion="right" style={{ width: 0, padding: 0 }} />
      </Menu.Menu>
    </Menu>
  );
}

export default AppHeader;