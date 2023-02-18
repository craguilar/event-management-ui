import * as React from "react";
import { Event } from "./model/Event";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import { Trans } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";

export interface EventDetailsProps {
  onSubmit: (event: any, mainEventDay: Date) => void;
  current: Event;
}

export interface EventDetailsState {
  startDate: Date;
}

export class EventDetails extends React.Component<
  EventDetailsProps,
  EventDetailsState
> {
  hideEmails = true;

  constructor(props: EventDetailsProps) {
    super(props);
    this.state = {
      startDate:
        props.current.eventDay != undefined
          ? new Date(props.current.eventDay)
          : new Date(),
    };
    // See https://stackoverflow.com/questions/59490111/react-typeerror-undefined-onsubmit
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onDateChange(date: Date) {
    this.setState({
      startDate: date,
    });
  }

  onFormSubmit(form: any) {
    this.props.onSubmit(form, this.state.startDate);
  }

  render() {
    const rowsInControl = 3;
    return (
      <div>
        <Form onSubmit={this.onFormSubmit}>
          <Form.Group controlId="plateInput">
            <Form.Label column>
              <Trans>Event Name</Trans>
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                placeholder="My Birthday"
                defaultValue={this.props.current.name}
                required
              />
            </Col>
          </Form.Group>
          <Row>
            <Form.Group as={Col} controlId="makeInput">
              <Form.Label column>
                <Trans>Main Location</Trans>
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="San Francisco"
                  defaultValue={this.props.current.mainLocation}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Col} controlId="modelInput">
              <Form.Label column>
                <Trans>Main event day</Trans>
              </Form.Label>
              <Col>
                <DatePicker
                  showTimeSelect
                  selected={this.state.startDate}
                  onChange={(date: Date) => {
                    this.onDateChange(date);
                  }}
                />
              </Col>
            </Form.Group>
          </Row>
          <br />
          <Form.Group as={Col} controlId="descriptionInput">
            <Form.Label>
              <Trans>Description</Trans>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={rowsInControl}
              defaultValue={this.props.current.description}
            />
          </Form.Group>
          <br />
          <Form.Group as={Col}>
            <Button className="float-end" variant="primary" type="submit">
              <Trans>Save changes</Trans>
            </Button>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
