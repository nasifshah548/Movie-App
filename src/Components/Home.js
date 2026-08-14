import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  Carousel,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { movieApiKey } from "../config";

// Defined genre list including the Erotic & Romance option
const GENRES = [
  { id: 0, name: "All" },
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 10749, name: "Erotic & Romance" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
];

const Home = () => {
  const [heroMovies, setHeroMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Trending Movies once on mount for the Top Hero Carousel
  useEffect(() => {
    const fetchHeroMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${movieApiKey}`,
        );
        setHeroMovies(response.data.results.slice(0, 5) || []);
      } catch (error) {
        console.error("Error fetching hero movies:", error);
      }
    };

    fetchHeroMovies();
  }, []);

  // 2. Fetch movies whenever the selected genre changes
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${movieApiKey}&sort_by=popularity.desc`;

        if (selectedGenre !== 0) {
          url += `&with_genres=${selectedGenre}`;
        }

        if (selectedGenre === 10749) {
          url += `&include_adult=true`;
        }

        const response = await axios.get(url);
        setMovies(response.data.results || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre]);

  return (
    <>
      {/* ================= HERO CAROUSEL ================= */}
      {heroMovies.length > 0 && (
        <Carousel
          fade
          controls={true}
          indicators={true}
          className="mb-2 hero-carousel"
        >
          {heroMovies.map((movie) => (
            <Carousel.Item key={movie.id}>
              <div
                className="carousel-backdrop-wrapper d-flex align-items-end"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(11, 15, 23, 1) 0%, rgba(11, 15, 23, 0.4) 50%, rgba(11, 15, 23, 0.8) 100%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                }}
              >
                <Container className="pt-0 pb-4">
                  <Row>
                    <Col md={8} lg={6}>
                      <Badge bg="danger" className="mb-2 px-3 py-2 fs-6">
                        ★{" "}
                        {movie.vote_average
                          ? movie.vote_average.toFixed(1)
                          : "N/A"}{" "}
                        Trending
                      </Badge>
                      <h1 className="hero-title fw-bold mb-3">{movie.title}</h1>
                      <p className="hero-overview line-clamp-3 text-light opacity-75 mb-4">
                        {movie.overview}
                      </p>
                      <Button
                        as={Link}
                        to={`/movie/${movie.id}`}
                        variant="danger"
                        size="lg"
                        className="fw-semibold shadow-sm"
                      >
                        <i className="fas fa-play me-2"></i>View Details
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      {/* ================= MAIN CONTENT GRID ================= */}
      <Container className="py-2">
        {/* Header Section with Film Icon */}
        <div className="page-header text-center mb-4">
          <h1 className="page-title d-flex align-items-center justify-content-center flex-wrap gap-2">
            <i className="fas fa-film text-danger fs-2"></i>
            <span>Cineplex Latests: Popular Popcorn Picks</span>
          </h1>
          <p className="page-subtitle">
            Discover trending movies, filter by genre, and explore high-rated
            cinema.
          </p>
        </div>
        {/* Genre Filter Bar (Semi-tabs) */}
        <div className="genre-filter-bar d-flex flex-nowrap overflow-auto gap-2 pb-3 mb-4 justify-content-start justify-content-md-center">
          {GENRES.map((genre) => (
            <Button
              key={genre.id}
              variant={
                selectedGenre === genre.id ? "danger" : "outline-secondary"
              }
              className="genre-chip rounded-pill px-3 py-2 text-nowrap"
              onClick={() => setSelectedGenre(genre.id)}
            >
              {genre.name}
            </Button>
          ))}
        </div>

        {/* Movies Grid / Loader */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" />
            <p className="mt-2 text-muted">Loading movies...</p>
          </div>
        ) : movies.length > 0 ? (
          <Row xs={2} sm={3} md={4} lg={5} className="g-4">
            {movies.map((movie) => (
              <Col key={movie.id}>
                <Link
                  to={`/movie/${movie.id}`}
                  className="movie-card-wrapper text-decoration-none"
                >
                  <Card className="movie-card h-100 bg-dark text-white border-0 shadow-sm position-relative">
                    {/* Rating Badge */}
                    {movie.vote_average > 0 && (
                      <Badge
                        bg="warning"
                        text="dark"
                        className="position-absolute top-0 end-0 m-2 px-2 py-1 rating-badge z-1"
                      >
                        ★ {movie.vote_average.toFixed(1)}
                      </Badge>
                    )}

                    {/* Poster Image */}
                    <div className="poster-container overflow-hidden rounded-top">
                      <Card.Img
                        variant="top"
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "https://via.placeholder.com/500x750?text=No+Poster"
                        }
                        alt={movie.title}
                        className="movie-poster img-fluid"
                      />
                    </div>

                    {/* Movie Title Body */}
                    <Card.Body className="movie-card-body p-3">
                      <Card.Title className="movie-title-text text-truncate fs-6 mb-1">
                        <strong>{movie.title}</strong>
                      </Card.Title>
                      <Card.Text className="small text-muted mb-0">
                        {movie.release_date
                          ? movie.release_date.split("-")[0]
                          : "N/A"}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5 text-muted">
            <h4>No movies found</h4>
            <p>Try selecting a different genre above.</p>
          </div>
        )}
      </Container>
    </>
  );
};

export default Home;
