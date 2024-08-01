import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../src/components/login/Login';
import { AuthProvider } from '../src/contexts/AuthContext';

describe('Login Component', () => {
  it('renders the login form', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create an account/i })).toBeInTheDocument();
  });
  it('shows an error message on failed login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      })
    ) as jest.Mock;
  
    render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );
  
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
  
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
    await waitFor(() => screen.getByText('Invalid credentials'));
  
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  
});