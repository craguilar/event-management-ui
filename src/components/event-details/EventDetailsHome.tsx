import * as React from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from "react-bootstrap/Container";
import { PageTitle } from "../common/PageTitle";
import { GuestList } from "../guests/GuestList";
import { useLocation } from "react-router";
import { EventSummary } from "../events/model/EventSummary";


function EventDetailsHome() {

  const { state } = useLocation();
  const currentEvent: EventSummary = state;

  return (
    <div>
      <br/>
      <Container>
        <PageTitle title={"Event : " + currentEvent.name} />
        <i>{currentEvent.mainLocation} on {currentEvent.eventDay}</i>
      </Container>
      <br/>
      <Container>
        <Tabs
          defaultActiveKey="guest"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="guest" title="Guests">
            <GuestList eventId={currentEvent.id}/>
          </Tab>
          <Tab eventKey="expense" title="Expenses" disabled>
            
          </Tab>
          <Tab eventKey="todo" title="To Do" disabled>
            
          </Tab>
        </Tabs>
      </Container >
    </div >
  )
}

export default EventDetailsHome;