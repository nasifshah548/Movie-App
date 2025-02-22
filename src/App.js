import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Movie from "./Components/Movie";
import News from "./Components/News";
import Blog from "./Components/Blog";
import { Container } from "react-bootstrap";
import NavigationBar from "./Components/NavigationBar";

function App() {
  return (
    <Router>
      <NavigationBar />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:movieId" element={<Movie />} />
          <Route path="/news" element={<News />} />
          <Route path="/blogs" element={<Blog />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;