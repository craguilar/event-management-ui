import * as React from "react";
import Container from "react-bootstrap/Container";

export class About extends React.Component {

  render() {
    return (
      <div>
        <Container>
          <h1>Cars Demo</h1>
          <p>This is a template project which can be used to bootstrap basic logic like authentication, routing and a basic type script React project.</p>
          <img src="http://placekitten.com/200/300" alt="Logo" />
        </Container>
      </div>
    );
  }
}

export default About;