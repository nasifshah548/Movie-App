import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import { newsApiKey } from "../config";
import "../App.css";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsUrl = `https://gnews.io/api/v4/search?q=Hollywood&lang=en&country=us&max=10&apikey=${newsApiKey}`;
        const response = await axios.get(newsUrl);
        setNewsList(response.data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5 my-5">
        <Spinner
          animation="border"
          variant="danger"
          style={{ width: "3rem", height: "3rem" }}
        />
        <p className="mt-3 text-muted fw-semibold">
          Loading latest Hollywood headlines...
        </p>
      </Container>
    );
  }

  const featuredArticle = newsList[0];
  const gridArticles = newsList.slice(1);

  return (
    <Container className="py-4 news-page-container">
      {/* Page Header */}
      <div className="page-header text-center mb-4">
        <h1 className="page-title d-flex align-items-center justify-content-center flex-wrap gap-2">
          <i className="fas fa-newspaper text-danger fs-2"></i>
          <span>Hollywood & Cinema Buzz</span>
        </h1>
        <p className="page-subtitle">
          Stay updated with breaking news, exclusive interviews, and industry
          updates.
        </p>
      </div>

      {/* 1. FEATURED SPOTLIGHT ARTICLE */}
      {featuredArticle && (
        <Card className="featured-news-card bg-dark text-white border-0 shadow-lg mb-5 overflow-hidden rounded-4">
          <Row className="g-0 align-items-center">
            <Col lg={7} className="overflow-hidden">
              <img
                src={
                  featuredArticle.image ||
                  "https://via.placeholder.com/800x450?text=Hollywood+News"
                }
                alt={featuredArticle.title}
                className="featured-news-img img-fluid w-100"
              />
            </Col>
            <Col lg={5}>
              <Card.Body className="p-4 p-lg-5">
                <Badge
                  bg="danger"
                  className="px-3 py-2 text-uppercase mb-3 fw-bold"
                >
                  Breaking News
                </Badge>
                <Card.Title className="featured-news-title display-6 fw-bold mb-3">
                  {featuredArticle.title}
                </Card.Title>
                <Card.Text className="featured-news-desc text-light opacity-75 mb-4">
                  {featuredArticle.description}
                </Card.Text>
                <div className="d-flex align-items-center justify-content-between">
                  <small className="text-muted">
                    {featuredArticle.publishedAt
                      ? new Date(
                          featuredArticle.publishedAt,
                        ).toLocaleDateString()
                      : "Recent"}
                  </small>
                  <Button
                    href={featuredArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="danger"
                    className="fw-bold px-4 py-2"
                  >
                    Read Full Story <i className="fas fa-arrow-right ms-2"></i>
                  </Button>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      )}

      {/* 2. RECENT HEADLINES GRID */}
      {gridArticles.length > 0 && (
        <section>
          <h3 className="news-section-heading mb-4 fw-bold">
            <i className="fas fa-bolt text-danger me-2"></i> Recent Stories
          </h3>
          <Row xs={1} md={2} lg={3} className="g-4">
            {gridArticles.map((article, index) => (
              <Col key={index}>
                <Card className="news-card h-100 bg-white border-0 shadow-sm rounded-3 overflow-hidden d-flex flex-column">
                  <div className="news-img-wrapper overflow-hidden">
                    <Card.Img
                      variant="top"
                      src={
                        article.image ||
                        "https://via.placeholder.com/500x280?text=News"
                      }
                      alt={article.title}
                      className="news-card-img"
                    />
                  </div>
                  <Card.Body className="d-flex flex-column p-4">
                    <Card.Title className="news-card-title fw-bold fs-5 mb-2">
                      {article.title}
                    </Card.Title>
                    <Card.Text className="news-card-desc text-secondary flex-grow-1 mb-3">
                      {article.description
                        ? article.description.slice(0, 110) + "..."
                        : "Click below to read the full article..."}
                    </Card.Text>
                    <div className="d-flex align-items-center justify-content-between pt-3 border-top border-light">
                      <small className="text-muted">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString()
                          : "Today"}
                      </small>
                      <Button
                        variant="outline-danger"
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fw-bold btn-sm"
                      >
                        Read More
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      )}
    </Container>
  );
};

export default News;
