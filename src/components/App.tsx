import React from 'react';
import { EventList } from "./events/EventsList";
import { EventDetailsHome } from "./event-details/EventDetailsHome"
import { About } from "./about/About";
import { NavBar } from "./common/NavBar";
import { Footer } from "./common/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App: React.FC = () => {

  return (
    <div className="App">
      <NavBar />
      <Router>
        <Routes>
          <Route path="/" element={<EventList userName="Anonymous" />} />
          <Route path="/about" element={<About />} />
          <Route path="/details" element={<EventDetailsHome />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;