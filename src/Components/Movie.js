import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { movieApiKey } from "../config";
import axios from "axios";
import { Container, Row, Col, Badge, Spinner } from "react-bootstrap";

const Movie = () => {
  const { movieId } = useParams(); // Direct hook access!
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const singleMovieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${movieApiKey}`;
    axios.get(singleMovieUrl).then((response) => {
      setMovie(response.data);
      setLoading(false);
    });
  }, [movieId]);

  if (loading) {
    return (
      <Container className="text-center mt-5 pt-5">
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <Container className="mt-4 mb-5">
      <div className="movie-detail-card">
        <Row className="align-items-center">
          <Col md={4} className="mb-4 mb-md-0">
            <img
              src={imageUrl}
              alt={movie.title}
              className="movie-detail-poster img-fluid"
            />
          </Col>
          <Col md={8}>
            <h1 className="fw-bold mb-2">
              {movie.title}{" "}
              <Badge className="rating-badge ms-2">
                ★ {movie.vote_average?.toFixed(1)}
              </Badge>
            </h1>
            {movie.tagline && (
              <p className="text-muted fst-italic mb-3">"{movie.tagline}"</p>
            )}

            <div className="mb-4">
              <h6 className="text-uppercase text-danger fw-bold fs-7">
                Overview
              </h6>
              <p className="lh-base" style={{ color: "#d1d5db" }}>
                {movie.overview}
              </p>
            </div>

            <Row className="g-3">
              <Col sm={6}>
                <span className="text-muted d-block small">Release Date</span>
                <span className="fw-medium">{movie.release_date}</span>
              </Col>
              <Col sm={6}>
                <span className="text-muted d-block small">Genres</span>
                <span className="fw-medium">
                  {movie.genres?.map((g) => g.name).join(", ")}
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Container>
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
