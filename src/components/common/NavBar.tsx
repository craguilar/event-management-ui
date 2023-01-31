import * as React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

// Properties
export interface NavBarProps {
  userName: string;
  signOut: React.MouseEventHandler | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NavBarState {}

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
          <Nav.Link href="/">Events</Nav.Link>
          <Nav.Link href="/about">About</Nav.Link>
          <Navbar.Toggle />
        </Nav>
        <Container>
          <Navbar.Collapse className="justify-content-end">
            <NavDropdown
              menuVariant="dark"
              title={this.props.userName}
              as={Navbar.Text}
              id="nav-dropdown"
            >
              <NavDropdown.Item href="profile" disabled>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={this.props.signOut}>
                Sign out
              </NavDropdown.Item>
            </NavDropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default NavBar;
