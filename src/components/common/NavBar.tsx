import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Trans } from 'react-i18next';

// Properties
export interface NavBarProps {
  userName: string;
  signOut: React.MouseEventHandler | undefined;
  changeLanguage: (language: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NavBarState { }

export class NavBar extends React.Component<NavBarProps, NavBarState> {
  render() {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="/">
          <img
            src="mesh-removebg-preview.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Event Service logo"
          />
          Event Management
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/"><Trans>Events</Trans></Nav.Link>
          <Nav.Link href="/about"><Trans>About</Trans></Nav.Link>
          <Navbar.Toggle />
        </Nav>
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <NavDropdown title={<Trans>Language</Trans>} menuVariant="dark" as={Navbar.Text} id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => this.props.changeLanguage("en")}>
                English
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.props.changeLanguage("es")}>
                Español
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              menuVariant="dark"
              title={this.props.userName}
              as={Navbar.Text}
              id="nav-dropdown"
            >
              <NavDropdown.Item href="profile" disabled>
                <Trans>Profile</Trans>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={this.props.signOut}>
                <Trans>Sign out</Trans>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
