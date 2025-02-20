import React, { Component } from "react";
import { useParams } from "react-router-dom";
import apiKey from "./config";
import axios from "axios";

class Movie extends Component {
    constructor() {
        super();
        this.state = {
            movie: {}
        }
    }

    componentDidMount() {
        let { movieId } = this.props.params;  // Getting the movieId from the router
        const singleMovieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
        axios.get(singleMovieUrl).then((response) => {
            console.log(response.data);
            this.setState({
                movie: response.data,
            })
        })
    }

    render() {

        if(this.state.movie.title === undefined) {
            return (
                <h1>Loading...</h1>
            )
        }

        const movie = this.state.movie;
        const imageUrl = `http://image.tmdb.org/t/p/w300${movie.poster_path}`;
        
        return (
            <div>
                <img src={imageUrl} alt={movie.title} />
                <p><strong>Title: {movie.title}</strong></p>
                <p>Budget: {movie.budget}</p>
                <p>Tagline: {movie.tagline}</p>
                <p>Overview: {movie.overview}</p>
                <p>Release Date: {movie.release_date}</p>
            </div>
        );
    }
}

// Wrap with a higher-order component to access params
function MovieWrapper(props) {
    let params = useParams();
    return <Movie {...props} params={params} />;
}

export default MovieWrapper;

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