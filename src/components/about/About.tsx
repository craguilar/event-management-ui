import * as React from "react";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../common/PageTitle";
import { FaUserAlt } from "react-icons/fa";
import { TbReportMoney } from "react-icons/tb";
import { FcTodoList } from "react-icons/fc";
import { BsHeartFill } from "react-icons/bs";

export class About extends React.Component {
  render() {
    return (
      <Container>
        <br />
        <PageTitle title={"Event Service"} />
        <p>
          This is project helps <b>YOU</b> to manage YOUR events!
        </p>
        <p>
          <span>The elements of your event that can be managed are:</span>
        </p>
        <ul>
          <li>
            <FaUserAlt /> <b style={{ color: "darkcyan" }}>Guests</b>. Allows you to Add/Update/Delete and Export your guests.
          </li>
          <li>
            <TbReportMoney /> <b style={{ color: "darkcyan" }}>Expenses</b>.&nbsp;Allows you to Add/Update/Delete expenses.
          </li>
          <li>
            <FcTodoList /> <b style={{ color: "darkcyan" }}>ToDo's</b>. Add ToDo's and mark them as Done.
          </li>
        </ul>
        <p>
          Enjoy <BsHeartFill style={{ color: "red" }} />!
        </p>
        <p>Carlos</p>
        <p>P.S Translating all pages to Spanish is a work in progress.</p>
      </Container>
    );
  }
}

export default About;
