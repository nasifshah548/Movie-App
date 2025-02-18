import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about/" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
