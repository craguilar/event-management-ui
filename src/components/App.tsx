import React from "react";
import { EventList } from "./events/EventsList";
import EventDetailsHome from "./event-details/EventDetailsHome";
import { About } from "./about/About";
import { NavBar } from "./common/NavBar";
import { Footer } from "./common/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  withAuthenticator,
  WithAuthenticatorProps,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const App = ({ signOut, user }: WithAuthenticatorProps) => {
  const userName =
    user == undefined || user.attributes == undefined
      ? "Anonymous"
      : user.attributes.email;

  return (
    <div className="App">
      <NavBar signOut={signOut} userName={userName} />
      <Router>
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/about" element={<About />} />
          <Route path="/details" element={<EventDetailsHome />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
};

export default withAuthenticator(App, {
  loginMechanisms: ["email"],
  hideSignUp: true,
});
