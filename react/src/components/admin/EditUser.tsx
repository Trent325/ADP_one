import React, { useState } from 'react';
import { Button, Form, Modal, Alert } from 'react-bootstrap';
import { useUpdateUser } from '../../hooks/admin/useUpdateUser';

interface EditUserProps {
  user: { _id: string; username: string; isAdmin: boolean };
  onHide: () => void;
  refetch: () => void;
}

const EditUser: React.FC<EditUserProps> = ({ user, onHide, refetch }) => {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);
  const [message, setMessage] = useState('');
  const { mutate: updateUser } = useUpdateUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(
      { id: user._id, updatedUser: { username, password, isAdmin } },
      {
        onSuccess: () => {
          setMessage('User updated successfully');
          refetch();
          onHide();
        },
        onError: () => {
          setMessage('Error updating user');
        },
      }
    );
  };

  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formIsAdmin">
            <Form.Check
              type="checkbox"
              label="Admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update User
          </Button>
          {message && <Alert variant="info">{message}</Alert>}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUser;
