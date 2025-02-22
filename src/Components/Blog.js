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
      // Editing existing blog
      const updatedBlogs = [...blogs];
      updatedBlogs[editingIndex] = { title, content, timestamp: `Edited at ${formattedDate}` };
      this.setState({ blogs: updatedBlogs, title: "", content: "", editingIndex: null });
    } else {
      // Adding a new blog
      const newBlog = { title, content, timestamp: `Published at ${formattedDate}` };
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
      <Container className="mt-4">
        <h2>Write a Movie Blog</h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={title}
              onChange={this.handleInputChange}
              placeholder="Enter blog title"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              value={content}
              onChange={this.handleInputChange}
              rows={4}
              placeholder="Write your blog..."
            />
          </Form.Group>

          <Button variant="success" onClick={this.handlePublish}>
            {editingIndex !== null ? "Update" : "Publish"}
          </Button>
        </Form>

        <h3 className="mt-5">Movie Blogs</h3>
        {blogs.map((x, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>{x.title}</Card.Title>
              <Card.Text>{x.content}</Card.Text>
              <Card.Footer className="text-muted">{x.timestamp}</Card.Footer>
              <Button variant="warning" className="me-2" onClick={() => this.handleEdit(index)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => this.handleDelete(index)}>
                Delete
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Container>
    );
  }
}

export default Blog;