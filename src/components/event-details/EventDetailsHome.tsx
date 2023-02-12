import * as React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Container from "react-bootstrap/Container";
import { DateFormat } from "../../dataUtils";
import { PageTitle } from "../common/PageTitle";
import { GuestList } from "../guests/GuestList";
import { ExpensesList } from "../expenses/ExpensesList";
import ToDo from "../todo/ToDo";
import { useLocation, useNavigate, Navigate } from "react-router";
import { EventSummary } from "../events/model/EventSummary";
import CloseButton from "react-bootstrap/CloseButton";
import { FaUserAlt } from "react-icons/fa";
import { TbReportMoney } from "react-icons/tb";
import { FcTodoList } from "react-icons/fc";

import moment from "moment";


function EventDetailsHome() {
  const { state } = useLocation();
  const currentEvent: EventSummary = state;
  const navigation = useNavigate();
  if (currentEvent == null || currentEvent == undefined) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <br />
      <Container>
        <CloseButton className="float-end" onClick={() => navigation("/")} />
        <PageTitle title={"Event : " + currentEvent.name} />
        <i>
          {currentEvent.mainLocation} on{" "}
          {moment(currentEvent.eventDay).format(
            DateFormat
          )}
        </i>
      </Container>
      <br />
      <Container>

        <Tabs
          defaultActiveKey="guest"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab
            eventKey="guest"
            title={
              <span>
                <FaUserAlt /> Guests
              </span>
            }
          >
            <GuestList eventId={currentEvent.id} />
          </Tab>
          <Tab
            eventKey="expense"
            title={
              <span>
                <TbReportMoney /> Expenses
              </span>
            }
          >
            <ExpensesList eventId={currentEvent.id} />
          </Tab>
          <Tab
            eventKey="todo"
            title={
              <span>
                <FcTodoList /> ToDo
              </span>
            }
          >
            <ToDo eventId={currentEvent.id} />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default EventDetailsHome;
