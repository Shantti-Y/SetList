import React from 'react';
import { Header, Navbar, Nav, Icon, Dropdown } from 'rsuite/lib';

const AppHeader = () => {
  return (
    <Header>
      <Navbar>
        <Navbar.Body>
          <Nav>
            <Dropdown icon={<Icon icon="bars" />}>
              <Dropdown.Item>About</Dropdown.Item>
            </Dropdown>
          </Nav>
          <Nav>
            <Nav.Item disabled>Set List</Nav.Item>
          </Nav>
        </Navbar.Body>
      </Navbar>
    </Header>
  );
}

export default AppHeader;