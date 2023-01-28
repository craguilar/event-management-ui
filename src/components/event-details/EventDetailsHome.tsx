import * as React from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from "react-bootstrap/Container";
import { PageTitle } from "../common/PageTitle";
import { Event } from "../events/model/Event"
import { GuestList } from "../guests/GuestList";

// Properties 
export interface EventFrameProps {
  event?: Event
}


export class EventDetailsHome extends React.Component<EventFrameProps> {
  render() {
    return (
      <div>
        <Container>
          <br />
          <PageTitle title={"Event :" + (this.props.event != undefined ? this.props.event.name : "No event selected ")} />
          <br />

          <Tabs
            defaultActiveKey="guest"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="guest" title="Guests">
              <GuestList />
            </Tab>
            <Tab eventKey="expense" title="Expenses" disabled>
              <GuestList />
            </Tab>
            <Tab eventKey="todo" title="To Do" disabled>
              <GuestList />
            </Tab>
          </Tabs>
        </Container>
      </div>
    )
  }
}
