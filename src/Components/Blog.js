import React, { Component } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";

class Blog extends Component {
  constructor() {
    super();
    this.state = {
      blogs: [],
      title: "",
      content: "",
      editingIndex: null,
    };
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handlePublish = () => {
    const { title, content, blogs, editingIndex } = this.state;
    if (!title || !content) return;

    const now = new Date();
    const formattedDate = now.toLocaleString();

    if (editingIndex !== null) {
      const updatedBlogs = [...blogs];
      updatedBlogs[editingIndex] = {
        title,
        content,
        timestamp: `Edited at ${formattedDate}`,
      };
      this.setState({
        blogs: updatedBlogs,
        title: "",
        content: "",
        editingIndex: null,
      });
    } else {
      const newBlog = {
        title,
        content,
        timestamp: `Published at ${formattedDate}`,
      };
      this.setState({ blogs: [newBlog, ...blogs], title: "", content: "" });
    }
  };

  handleEdit = (index) => {
    const { title, content } = this.state.blogs[index];
    this.setState({ title, content, editingIndex: index });
  };

  handleDelete = (index) => {
    const updatedBlogs = this.state.blogs.filter((_, i) => i !== index);
    this.setState({ blogs: updatedBlogs });
  };

  render() {
    const { blogs, title, content, editingIndex } = this.state;

    return (
      <Container className="py-4" style={{ maxWidth: "800px" }}>
        <div className="page-header text-start mb-4">
          <h2 className="page-title fs-3">Community Movie Blog</h2>
          <p className="page-subtitle">
            Share reviews, theories, and cinema thoughts
          </p>
        </div>

        <Card className="blog-form-card mb-5 p-3">
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Blog Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={title}
                  onChange={this.handleInputChange}
                  placeholder="e.g. Why Dune Part 2 is a masterpiece"
                  className="form-control-dark"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Content</Form.Label>
                <Form.Control
                  as="textarea"
                  name="content"
                  value={content}
                  onChange={this.handleInputChange}
                  rows={4}
                  placeholder="Write your review or article here..."
                  className="form-control-dark"
                />
              </Form.Group>

              <Button
                variant="danger"
                className="px-4 fw-bold"
                onClick={this.handlePublish}
              >
                {editingIndex !== null ? "Update Post" : "Publish Article"}
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {blogs.map((x, index) => (
          <Card key={index} className="blog-post-card mb-3">
            <Card.Body>
              <Card.Title className="fw-bold">{x.title}</Card.Title>
              <Card.Text className="text-light">{x.content}</Card.Text>
              <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
                <small className="text-muted">{x.timestamp}</small>
                <div>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => this.handleEdit(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => this.handleDelete(index)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </Container>
    );
  }
}

export default Blog;
