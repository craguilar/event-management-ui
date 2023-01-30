import * as React from "react";
import Guest from "./model/Guest";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export interface GuestDetailsProps {
  onSubmit: (event: any) => void,
}

export class GuestDetail extends React.Component<GuestDetailsProps>{

  current = {} as Guest

  render() {
    return (
      <div>
        <Form onSubmit={this.props.onSubmit}>
          <Row>
            <Form.Group as={Col}>
              <Form.Label column >
                First Name
              </Form.Label>
              <Col>
                <Form.Control type="text" placeholder="John" value={this.current.firstName} required />
              </Col>
            </Form.Group>
            <Form.Group as={Col} >
              <Form.Label column>
                Last Name
              </Form.Label>
              <Col>
                <Form.Control type="text" placeholder="Doe" defaultValue={this.current.lastName} required />
              </Col>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} controlId="makeInput">
              <Form.Label column >
                Email
              </Form.Label>
              <Col>
                <Form.Control type="email" placeholder="john.doe@my.com" defaultValue={this.current.email} />
              </Col>
            </Form.Group>
            <Form.Group as={Col} controlId="modelInput">
              <Form.Label column>
                Phone
              </Form.Label>
              <Col>
                <Form.Control type="text" placeholder="..." defaultValue={this.current.phone} />
              </Col>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label column>
                Number of seats
              </Form.Label>
              <Col>
                <Form.Control type="number" placeholder="1" defaultValue={this.current.numberOfSeats} required />
              </Col>
            </Form.Group>
          </Row>
          <Row >
            <Form.Group as={Col}  controlId="validationCustom03">
              <Form.Label column>Country</Form.Label>
              <Form.Control type="text" placeholder="Mexico" defaultValue={this.current.country} required />
              <Form.Control.Feedback type="invalid">
                Please provide a valid country
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationCustom04">
              <Form.Label column>State</Form.Label>
              <Form.Control type="text" placeholder="State" defaultValue={this.current.state}  />
              <Form.Control.Feedback type="invalid">
                Please provide a valid state.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationCustom05">
              <Form.Label column>Guest of</Form.Label>
              <Form.Control type="text" placeholder="Event owner" defaultValue={this.current.guestOf} />
              <Form.Control.Feedback type="invalid">
                Who is this guest of?
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Form.Group>
              <Form.Check
                type="switch"
                label="Is tentative guest"
                checked={this.current.isTentative}
              />
            </Form.Group>
          </Row>
          <br />
          <Form.Group as={Col}>
            <Button variant="primary" type="submit" >Submit</Button>
          </Form.Group>
        </Form>
      </div>);
  }
}