import React, { Component } from "react";
import axios from "axios";
import { movieApiKey } from "../config";
import { Link } from "react-router-dom";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import "../App.css"; 

class Home extends Component {
  constructor() {
    super();
    this.state = {
      movieList: [],
      loading: true,
    };
  }

  componentDidMount() {
    const nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${movieApiKey}`;
    axios.get(nowPlayingUrl).then((response) => {
      this.setState({
        movieList: response.data.results,
        loading: false,
      });
    });
  }

  render() {
    const { movieList, loading } = this.state;
    const imageUrl = "http://image.tmdb.org/t/p/w300"; // Base URL for images

    if (loading) {
      return (
        <Container className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </Container>
      );
    }

    return (
      <Container>
        {/* Title Section with Icon */}
        <div className="text-center my-4">
          <h1 className="title">
            <i className="fas fa-film"></i> Cineplex Latests: Popular Popcorn Picks
          </h1>
        </div>

        {/* Movie Cards */}
        <Row className="movie-grid">
          {movieList.map((x, index) => (
            <Col key={index} className="d-flex justify-content-center">
              <Link to={`/movie/${x.id}`} style={{ textDecoration: "none" }}>
                <Card className="movie-card">
                  <Card.Img 
                    variant="top" 
                    src={`${imageUrl}${x.poster_path}`} 
                    className="movie-poster" 
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
}

export default Home;