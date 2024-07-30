import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Clear authentication data
    navigate('/'); // Redirect to login page
  };

  return (
    <Container fluid className="bg-light p-4 min-vh-100">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center text-primary">Admin Dashboard</h1>
        </Col>
      </Row>

      <Row className="justify-content-center mb-4">
        <Col md={3} className="d-flex justify-content-center">
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Manage Users</Card.Title>
              <Card.Text>View, add, or remove users from the system.</Card.Text>
              <Link to="/admin-users">
                <Button variant="primary">Go to Users</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="d-flex justify-content-center">
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>System Reports</Card.Title>
              <Card.Text>Generate and view system reports.</Card.Text>
              <Link to="/admin/reports">
                <Button variant="primary">View Reports</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <Button onClick={handleLogout} variant="danger">Logout</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
