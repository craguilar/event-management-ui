import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

// Properties 


export class NavBar extends React.Component {

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">Event Management</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/">Events</Nav.Link>
            <Nav.Link href="about">About</Nav.Link>
          </Nav>
        </Navbar>
      </div>
    )
  }
}

export default NavBar