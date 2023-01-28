import * as React from "react";
import { Event } from "./model/Event";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export interface EventDetailsProps {
  onSubmit: (event: any) => void,
  current: Event,
}

export class EventDetails extends React.Component<EventDetailsProps>{


  render() {
    const rowsInControl = 3;
    return (
      <div>
        <Form onSubmit={this.props.onSubmit}>
          <Form.Group controlId="plateInput">
            <Form.Label column >
              Event Name
            </Form.Label>
            <Col>
              <Form.Control type="text" placeholder="My Birthday" value={this.props.current.name} required />
            </Col>
          </Form.Group>
          <Row>
            <Form.Group as={Col} controlId="makeInput">
              <Form.Label column >
                Main Location
              </Form.Label>
              <Col>
                <Form.Control type="text" placeholder="San Francisco" defaultValue={this.props.current.mainLocation} required />
              </Col>
            </Form.Group>
            <Form.Group as={Col} controlId="modelInput">
              <Form.Label column>
                Main event day
              </Form.Label>
              <Col>
                <Form.Control type="text" placeholder="..." defaultValue={this.props.current.eventDay} required />
              </Col>
            </Form.Group>
          </Row>
          <Form.Group as={Col} controlId="descriptionInput">
            <Form.Label >
              Description
            </Form.Label>
            <Form.Control as="textarea" rows={rowsInControl} defaultValue={this.props.current.description} />
          </Form.Group>
          <br/>
          <Form.Group as={Col}>
            <Button variant="primary" type="submit" >Submit</Button>
          </Form.Group>
        </Form>
      </div>);
  }
}