import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Event } from "./model/Event";
import { EventRepository } from "./EventRepository";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";


export interface CopyFromProps {
  onSubmit: (event: any) => void;
  eventId: string;
}


function CopyFrom(props: CopyFromProps) {

  const repository = new EventRepository();
  const [events, setEvents] = useState<Event[]>([]);


  const listEvents = () => {
    repository
      .list()
      .then(results => {
        setEvents(results);
      })
      .catch(error => {
        alert(error);
      });
  }

  useEffect(() => {
    listEvents();
  }, []);


  return (
    <div>
      <Form onSubmit={props.onSubmit}>
        <Row>
          <Table striped responsive hover>
            <thead>
              <tr>
                <th>
                  Select
                </th>
                <th>
                  Name
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => {
                return (
                  <tr key={"tr-" + event.id}>
                    <td>
                      <Form.Check
                        name={event.name}
                        id={event.id}
                        type="radio"
                        aria-label="radio 1" />
                    </td>
                    <td>{event.name} @ {event.mainLocation}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Row>
        <br />
        <Row>
          <Form.Group as={Col}>
            <Button variant="primary" type="submit">
              Copy
            </Button>
          </Form.Group>
        </Row>
      </Form>
    </div>
  );
}

export default CopyFrom;