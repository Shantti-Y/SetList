import React from 'react';
import { Menu, Segment, Icon } from 'semantic-ui-react';

import './style.scss';

const AppHeader = props => {
  return (
    <Menu inverted attached>
      <Menu.Item
        name='menu'
        active={true}
        onClick={props.onOpenMenubar}
        icon={<Icon name="bars" />}
      />
      <Menu.Header className="header-name">
        <h1>Set List</h1>
      </Menu.Header>
    </Menu>
  );
}

export default AppHeader;