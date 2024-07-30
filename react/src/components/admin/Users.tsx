import React from 'react';
import { Spinner, Alert, ListGroup, Button } from 'react-bootstrap';
import { useAllUsers } from '../../hooks/admin/useGetUsers';
import { useDeleteUser } from '../../hooks/admin/useDeleteUser';
import AddUser from './AddUser';

const AdminUsers: React.FC = () => {
  const { data: users, error, isLoading, refetch } = useAllUsers();
  const { mutate: deleteUser } = useDeleteUser();

  const handleUserDeleted = (id: string) => {
    deleteUser(id, {
      onSuccess: () => {
        refetch(); // Refetch the user list after deletion
      },
      onError: (error) => {
        console.error('Error deleting user:', error);
      },
    });
  };

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
    <div className="container">
      <h2 className="text-center mb-4">All Users</h2>
      <AddUser />
      <ListGroup>
        {users.map((user: { id: string; username: string }) => (
          <ListGroup.Item key={user.id}>
            {user.username}
            <Button
              variant="danger"
              onClick={() => handleUserDeleted(user.id)}
              className="float-end"
            >
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default AdminUsers;
