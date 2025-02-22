import React, { Component } from "react";
import axios from "axios";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import { newsApiKey } from "../config";
import "../App.css"; 

class News extends Component {
  constructor() {
    super();
    this.state = {
      newsList: [],
      loading: true,
    };
  }

  componentDidMount() {
    const newsUrl = `https://gnews.io/api/v4/search?q=Hollywood&lang=en&country=us&max=9&apikey=${newsApiKey}`;
    axios.get(newsUrl).then((response) => {
        this.setState({
          newsList: response.data.articles,
          loading: false,
        });
      }).catch((error) => {
        console.error("Error fetching news:", error);
        this.setState({ loading: false });
      });
  }

  render() {
    const { newsList, loading } = this.state;

    if (loading) {
      return (
        <Container className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </Container>
      );
    }

    return (
        <Container className="news-container">
        <h2 className="news-heading">Hollywood News</h2>
        <div className="news-grid">
          {newsList.map((x, index) => (
            <Card key={index} className="news-card">
              <Card.Img variant="top" src={x.image} alt="Hollywood" className="news-card-img" />
              <Card.Body className="news-content">
                <Card.Title className="news-title"><strong>{x.title}</strong></Card.Title>
                <Card.Text className="news-description">
                  <em>{x.description ? x.description.slice(0, 100) + "..." : "No description available."}</em>
                </Card.Text>
                <Button variant="primary" href={x.url} target="_blank" className="news-button">
                  Read More...
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>      
    );
  }
}

export default News;