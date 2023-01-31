import * as React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../common/PageTitle";
import { GuestList } from "../guests/GuestList";
import ToDo from "../todo/ToDo"
import { useLocation, useNavigate } from "react-router";
import { EventSummary } from "../events/model/EventSummary";
import CloseButton from "react-bootstrap/CloseButton";

import moment from "moment";

function EventDetailsHome() {
  const { state } = useLocation();
  const currentEvent: EventSummary = state;
  const navigation = useNavigate();

  return (
    <div>
      <br />
      <Container>
        <PageTitle title={"Event : " + currentEvent.name} />
        <i>
          {currentEvent.mainLocation} on{" "}
          {moment(currentEvent.eventDay).format(
            "dddd, MMMM Do YYYY, h:mm:ss a"
          )}
        </i>
      </Container>
      <br />
      <Container>
        <CloseButton className="float-end" onClick={() => navigation("/")} />
        <Tabs defaultActiveKey="guest" id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="guest" title="Guests">
            <GuestList eventId={currentEvent.id} />
          </Tab>
          <Tab eventKey="expense" title="Expenses" disabled>

          </Tab>
          <Tab eventKey="todo" title="To Do" >
            <ToDo />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default EventDetailsHome;
