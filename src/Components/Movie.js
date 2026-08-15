import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { movieApiKey } from "../config";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Badge,
  Spinner,
  Card,
  Button,
} from "react-bootstrap";

const Movie = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      window.scrollTo(0, 0); // Scroll to top when loading a new movie

      try {
        // Fetch Movie Details, Credits (Cast), and Similar Movies in parallel
        const [movieRes, creditsRes, similarRes] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${movieApiKey}`,
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${movieApiKey}`,
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${movieApiKey}`,
          ),
        ]);

        setMovie(movieRes.data);
        setCast(creditsRes.data.cast.slice(0, 10)); // Top 10 cast members
        setSimilarMovies(similarRes.data.results.slice(0, 5)); // Top 5 similar recommendations
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (loading) {
    return (
      <Container className="text-center py-5 my-5">
        <Spinner
          animation="border"
          variant="danger"
          style={{ width: "3rem", height: "3rem" }}
        />
        <p className="mt-3 text-muted fw-semibold">Loading movie details...</p>
      </Container>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <div className="movie-details-page">
      {/* ================= 1. HERO BACKDROP BANNER ================= */}
      <div
        className="movie-hero-banner position-relative d-flex align-items-end"
        style={{
          backgroundImage: backdropUrl
            ? `linear-gradient(to bottom, rgba(11, 15, 23, 0.5) 0%, rgba(11, 15, 23, 0.95) 85%, rgba(11, 15, 23, 1) 100%), url(${backdropUrl})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          minHeight: "520px",
        }}
      >
        <Container className="py-4 position-relative z-2">
          <Row className="align-items-end g-4">
            {/* Poster Column */}
            <Col
              xs={12}
              sm={5}
              md={4}
              lg={3}
              className="text-center text-sm-start"
            >
              <img
                src={posterUrl}
                alt={movie.title}
                className="img-fluid rounded-3 shadow-lg movie-details-poster"
              />
            </Col>

            {/* Movie Title & Essential Meta */}
            <Col xs={12} sm={7} md={8} lg={9}>
              <div className="hero-meta-content">
                {movie.vote_average > 0 && (
                  <Badge
                    bg="warning"
                    text="dark"
                    className="fs-6 px-3 py-2 fw-bold mb-3"
                  >
                    ★ {movie.vote_average.toFixed(1)} / 10 IMDb
                  </Badge>
                )}
                <h1 className="display-4 fw-extrabold text-white mb-2">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="fs-5 text-light opacity-75 fst-italic mb-3">
                    "{movie.tagline}"
                  </p>
                )}

                {/* Genre Pills */}
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {movie.genres?.map((g) => (
                    <Badge
                      key={g.id}
                      bg="danger"
                      className="px-3 py-2 rounded-pill fw-semibold"
                    >
                      {g.name}
                    </Badge>
                  ))}
                </div>

                {/* Key Quick Stats */}
                <Row className="g-3 text-light border-top border-secondary border-opacity-25 pt-3">
                  <Col xs={6} sm={4} md={3}>
                    <small className="text-muted d-block text-uppercase fw-semibold">
                      Release Date
                    </small>
                    <span className="fw-semibold">
                      {movie.release_date || "N/A"}
                    </span>
                  </Col>
                  <Col xs={6} sm={4} md={3}>
                    <small className="text-muted d-block text-uppercase fw-semibold">
                      Runtime
                    </small>
                    <span className="fw-semibold">
                      {movie.runtime ? `${movie.runtime} mins` : "N/A"}
                    </span>
                  </Col>
                  <Col xs={6} sm={4} md={3}>
                    <small className="text-muted d-block text-uppercase fw-semibold">
                      Status
                    </small>
                    <span className="fw-semibold">
                      {movie.status || "Released"}
                    </span>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ================= 2. OVERVIEW & CAST SECTION ================= */}
      <Container className="py-5">
        <Row className="g-5">
          <Col lg={8}>
            {/* 1. MOVIE OVERVIEW SECTION */}
            <section className="mb-5">
              <h3
                className="fw-bold mb-3 d-flex align-items-center"
                style={{
                  color: "#1a202c",
                  fontFamily: "'Aptos', 'Segoe UI', sans-serif",
                }}
              >
                <i className="fas fa-align-left text-danger me-2 fs-4"></i>{" "}
                Movie Overview
              </h3>
              <p
                className="movie-overview-text fs-5 lh-lg shadow-sm"
                style={{
                  color: "#1a202c",
                  backgroundColor: "#ffffff",
                  padding: "1.25rem",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontFamily: "'Aptos', 'Segoe UI', sans-serif",
                }}
              >
                {movie.overview}
              </p>
            </section>

            {/* 2. CASTS SECTION */}
            {cast.length > 0 && (
              <section className="mb-5">
                <h3
                  className="fw-bold mb-4 d-flex align-items-center"
                  style={{
                    color: "#1a202c",
                    fontFamily: "'Aptos', 'Segoe UI', sans-serif",
                  }}
                >
                  <i className="fas fa-user-friends text-danger me-2 fs-4"></i>{" "}
                  Casts
                </h3>
                <div className="d-flex overflow-auto gap-3 pb-3 custom-scrollbar">
                  {cast.map((person) => (
                    <div
                      key={person.id}
                      style={{ minWidth: "130px", maxWidth: "130px" }}
                    >
                      <Card className="bg-dark text-white border-0 shadow-sm h-100 text-center">
                        <Card.Img
                          variant="top"
                          src={
                            person.profile_path
                              ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                              : "https://via.placeholder.com/185x278?text=No+Photo"
                          }
                          alt={person.name}
                          className="rounded-top img-fluid"
                          style={{ height: "160px", objectFit: "cover" }}
                        />
                        <Card.Body className="p-2">
                          <div className="fw-bold fs-7 text-truncate">
                            {person.name}
                          </div>
                          <small className="text-muted d-block text-truncate fs-8">
                            {person.character}
                          </small>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </Col>

          {/* Sidebar Info Card */}
          <Col lg={4}>
            <div className="p-4 rounded-3 bg-dark text-white shadow-sm border border-secondary border-opacity-25">
              <h4 className="fw-bold mb-4 border-bottom border-secondary border-opacity-25 pb-2">
                Movie Details
              </h4>
              <div className="mb-3">
                <span className="text-muted d-block small">Original Title</span>
                <span className="fw-semibold fs-6">{movie.original_title}</span>
              </div>
              <div className="mb-3">
                <span className="text-muted d-block small">
                  Original Language
                </span>
                <span className="fw-semibold fs-6 text-uppercase">
                  {movie.original_language}
                </span>
              </div>
              <div className="mb-3">
                <span className="text-muted d-block small">Budget</span>
                <span className="fw-semibold fs-6">
                  {movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}
                </span>
              </div>
              <div className="mb-3">
                <span className="text-muted d-block small">Revenue</span>
                <span className="fw-semibold fs-6">
                  {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}
                </span>
              </div>
              {movie.homepage && (
                <Button
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline-danger"
                  className="w-100 mt-2 fw-bold"
                >
                  <i className="fas fa-external-link-alt me-2"></i> Official
                  Website
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {/* 3. RELATED MOVIES SECTION */}
        {similarMovies.length > 0 && (
          <section className="mt-5 pt-4 border-top border-secondary border-opacity-25">
            <h3
              className="fw-bold mb-4 d-flex align-items-center"
              style={{
                color: "#1a202c",
                fontFamily: "'Aptos', 'Segoe UI', sans-serif",
              }}
            >
              <i className="fas fa-film text-danger me-2 fs-4"></i> Related
              Movies
            </h3>
            <Row xs={2} sm={3} md={4} lg={5} className="g-4">
              {similarMovies.map((simMovie) => (
                <Col key={simMovie.id}>
                  <Link
                    to={`/movie/${simMovie.id}`}
                    className="text-decoration-none"
                  >
                    <Card className="h-100 bg-dark text-white border-0 shadow-sm position-relative">
                      {simMovie.vote_average > 0 && (
                        <Badge
                          bg="warning"
                          text="dark"
                          className="position-absolute top-0 end-0 m-2 px-2 py-1 rating-badge z-1"
                        >
                          ★ {simMovie.vote_average.toFixed(1)}
                        </Badge>
                      )}
                      <div className="overflow-hidden rounded-top">
                        <Card.Img
                          variant="top"
                          src={
                            simMovie.poster_path
                              ? `https://image.tmdb.org/t/p/w500${simMovie.poster_path}`
                              : "https://via.placeholder.com/500x750?text=No+Poster"
                          }
                          alt={simMovie.title}
                          className="img-fluid"
                        />
                      </div>
                      <Card.Body className="p-3 text-center">
                        <Card.Title className="fs-6 text-truncate mb-1 text-white">
                          <strong>{simMovie.title}</strong>
                        </Card.Title>
                        <Card.Text className="small text-muted mb-0">
                          {simMovie.release_date
                            ? simMovie.release_date.split("-")[0]
                            : "N/A"}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </section>
        )}
      </Container>
    </div>
  );
};

export default Movie;

/*

React Router v6+ removes this.props.match
- We now use useParams() for getting route parameters.

The movieId is stored in the URL (/movie/:movieId)
- useParams() extracts the movieId from the URL.

Converting Movie.js to a function component simplifies things.
- React Router v6+ is designed with hooks (useParams(), useNavigate(), etc.).
- Hooks work only in function components.

return <Movie {...props} params={params} />;

Understanding {...props}:
- The {...props} syntax is spread syntax, 
which spreads all properties (props) that MovieWrapper receives and passes them down to Movie.

Example Breakdown:
Let's say MovieWrapper receives some props from the Route in App.js like this:

<Route path="/movie/:movieId" element={<MovieWrapper someProp="hello" />} />

Now, inside MovieWrapper, props contains:

{ someProp: "hello" }

The spread syntax {...props} passes all of these props to Movie like this:

<Movie someProp="hello" params={params} />

Why Use {...props}?

- It ensures that Movie gets all props that MovieWrapper receives.

- This is useful if later, Movie needs additional props besides params.

Understanding params={params}:

The useParams() hook extracts route parameters (like movieId) from the URL.

const { movieId } = useParams();

For example, if the URL is /movie/822119, useParams() will return:

{ movieId: "822119" }

Then we pass this params object explicitly to Movie:

<Movie {...props} params={params} />

Now, inside Movie, we can access:

this.props.params.movieId

Full Flow

1. The user clicks a movie poster → navigates to /movie/822119.

2. App.js renders MovieWrapper for the /movie/:movieId route.

3. useParams() inside MovieWrapper extracts { movieId: "822119" }.

4. MovieWrapper returns:

<Movie {...props} params={{ movieId: "822119" }} />

5. Inside Movie.js, we can now use:

this.props.params.movieId  // "822119"

Why This Fix Works:

1. React Router v6 removed this.props.match, so we need to use useParams().

2. useParams() only works in function components, but Movie is a class component.

3. MovieWrapper acts as a bridge:
    - It extracts movieId using useParams().
    - It forwards params as a prop to the Movie Component.

Final Thoughts:

1. {...props} → Spreads all received props to Movie (useful for future additions).

2. params={params} → Explicitly sends extracted movieId to Movie.

3. MovieWrapper is just a wrapper that helps a class component access useParams().

Alternative: If we convert Movie.js to a function component, then we won't need MovieWrapper at all! 
Just use useParams() directly inside Movie.

*/
