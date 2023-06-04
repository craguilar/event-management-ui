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
        <PageTitle title={"App Event Management"} />
        <p>
          App Event Service is a service that helps <b>YOU</b> to manage YOUR events!  We believe that organizing events
          should be a seamless and enjoyable experience. Our user-friendly web page provides a comprehensive suite of
          features that allow you to plan, manage, and track your event effortlessly. Whether you're organizing a small
          gathering or a large-scale conference, we have you covered.
        </p>
        <p>
          <span>The elements of your event that can be managed are:</span>
        </p>
        <h4><FaUserAlt /> <b style={{ color: "darkcyan" }}>Guests</b></h4>
        <p>
          Our platform allows you to effortlessly handle your  guest list. You have the flexibility to add, update, and delete
          guests as needed. Simply enter their details, such as name, email, and any additional information you require.
          You can even export your guest list for further analysis or communication.
        </p>
        <h4><TbReportMoney /> <b style={{ color: "darkcyan" }}>Expenses</b></h4>
        <p>
          Tracking event expenses is essential for staying within budget. With our platform, you can easily manage all your
          event expenses in one place. Add new expenses, update existing ones, and delete items that are no longer relevant.
          You can categorize expenses and add descriptions to ensure accurate financial management.
        </p>
        <h4><FcTodoList /> <b style={{ color: "darkcyan" }}>ToDo's</b></h4>
        <p>
        Stay organized and on top of your tasks with our integrated ToDo list feature. 
        Create a list of tasks that need to be completed before, during, or after your event. You can add new tasks and mark
        them as done once completed. This way, you can keep track of your progress and ensure that everything is taken care of.
        </p>
        <p>
          Start planning your next event with us and experience the difference today! <BsHeartFill style={{ color: "red" }} />!
        </p>
        <p>P.S Translating all pages to Spanish is a work in progress.</p>
      </Container>
    );
  }
}

export default About;
