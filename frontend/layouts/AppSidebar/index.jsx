import React from 'react';
import { Sidebar, Menu, Icon, Divider } from 'semantic-ui-react';

const AppSidebar = props => {
  return (
    <Sidebar
      as={Menu}
      animation='overlay'
      inverted
      onHide={props.onCloseMenubar}
      vertical
      visible={props.isOpened}
      width='thin'
    >
      <Menu.Item name="about">
        <Icon size="large" name='help circle' />
        About
      </Menu.Item>
      <Menu.Item name="author">
        <Icon size="large" name='id card' />
        Author
      </Menu.Item>
    </Sidebar>
  );
}

export default AppSidebar;