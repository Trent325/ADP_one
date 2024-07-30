import React from "react";
import { useAllUsers } from "../../hooks/admin/useGetUsers";
import { Spinner, Alert, ListGroup } from "react-bootstrap";

const AdminUsers: React.FC = () => {
  const { data: users, error, isLoading } = useAllUsers();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Error fetching users</Alert>;
  }

  if (!users || users.length === 0) {
    return <Alert variant="info">No users found.</Alert>;
  }

  return (
    <div>
      <h2>All Users</h2>
      <ListGroup>
        {users.map((user: { id: string; username: string }) => (
          <ListGroup.Item key={user.id}>{user.username}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default AdminUsers;
