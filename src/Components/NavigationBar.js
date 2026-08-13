import React, { useState, useEffect, useRef } from "react";
import {
  Navbar,
  Container,
  Nav,
  Form,
  InputGroup,
  ListGroup,
  Image,
  Spinner,
  Button,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { movieApiKey } from "../config";

const NavigationBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Fetch search results from TMDB as the user types
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    setShowDropdown(true);

    const delayDebounceFn = setTimeout(() => {
      const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${movieApiKey}&query=${encodeURIComponent(
        query,
      )}`;

      axios
        .get(searchUrl)
        .then((response) => {
          setResults(response.data.results.slice(0, 6)); // Top 6 matches
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error searching movies:", error);
          setLoading(false);
        });
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Close dropdown if user clicks anywhere outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper function to handle movie selection
  const handleSelectMovie = (movieId) => {
    setQuery("");
    setShowDropdown(false);
    navigate(`/movie/${movieId}`);
  };

  // Handle Form Submission (Pressing Enter or Clicking Search Button)
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevents full page reload
    if (results.length > 0) {
      // Navigate to the top / best search result immediately
      handleSelectMovie(results[0].id);
    }
  };

  return (
    <Navbar expand="lg" className="custom-navbar sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo me-4">
          <i className="fas fa-play-circle me-2 text-danger"></i>CineStream
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-light" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/news" className="nav-link-custom">
              News
            </Nav.Link>
            <Nav.Link as={Link} to="/blogs" className="nav-link-custom">
              Blogs
            </Nav.Link>
          </Nav>

          {/* Dynamic IMDb-style Search Container */}
          <div
            ref={searchRef}
            className="position-relative search-container my-2 my-lg-0"
          >
            <Form onSubmit={handleSearchSubmit}>
              <InputGroup>
                {/* Search Icon / Clickable Submit Button */}
                <Button
                  type="submit"
                  variant="outline-secondary"
                  className="search-icon-bg border-end-0"
                >
                  <i className="fas fa-search"></i>
                </Button>

                <Form.Control
                  type="text"
                  placeholder="Search movies..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => query.trim() && setShowDropdown(true)}
                  className="search-input"
                />

                {loading && (
                  <InputGroup.Text className="search-icon-bg border-start-0">
                    <Spinner animation="border" size="sm" variant="danger" />
                  </InputGroup.Text>
                )}
              </InputGroup>
            </Form>

            {/* Dropdown Overlay Results */}
            {showDropdown && (
              <ListGroup className="search-dropdown-results shadow-lg">
                {results.length > 0
                  ? results.map((movie) => (
                      <ListGroup.Item
                        key={movie.id}
                        action
                        onClick={() => handleSelectMovie(movie.id)}
                        className="search-result-item d-flex align-items-center"
                      >
                        <Image
                          src={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                              : "https://via.placeholder.com/45x68?text=No+Img"
                          }
                          alt={movie.title}
                          className="search-result-poster me-3"
                        />
                        <div className="text-truncate">
                          <div className="search-result-title text-truncate">
                            {movie.title}
                          </div>
                          <small className="text-muted">
                            {movie.release_date
                              ? movie.release_date.split("-")[0]
                              : "N/A"}
                            {movie.vote_average
                              ? ` • ★ ${movie.vote_average.toFixed(1)}`
                              : ""}
                          </small>
                        </div>
                      </ListGroup.Item>
                    ))
                  : !loading && (
                      <ListGroup.Item className="search-result-item text-muted text-center py-3">
                        No movies found for "{query}"
                      </ListGroup.Item>
                    )}
              </ListGroup>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
