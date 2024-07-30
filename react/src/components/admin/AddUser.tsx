import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useAddUser } from '../../hooks/admin/useAddUser';

const AddUser: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const { mutate: addUser } = useAddUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    addUser({ username, password, isAdmin }, {
      onSuccess: () => {
        setMessage('User added successfully');
        setUsername('');
        setPassword('');
        setIsAdmin(false);
      },
      onError: () => {
        setMessage('Error adding user');
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
        Add User
      </Button>
      {message && <Alert variant="info">{message}</Alert>}
    </Form>
  );
};

export default AddUser;
