import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import { authService } from '../services/api';
import { MemoryRouter } from 'react-router-dom';

// Mock navigation and services
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../services/api', () => ({
  authService: {
    login: jest.fn(),
  },
}));

describe('LoginPage', () => {
  const handleClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows validation errors if fields are empty', async () => {
    render(
      <MemoryRouter>
        <LoginPage open={true} handleClose={handleClose} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Sign In/i));

    await waitFor(() => {
      const errors = screen.getAllByText('Required');
      expect(errors).toHaveLength(2);
    });
  });

  test('calls login and navigates on successful login', async () => {
    authService.login.mockResolvedValue({ token: 'abc123' });

    render(
      <MemoryRouter>
        <LoginPage open={true} handleClose={handleClose} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'testuser' },
    });

    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'testpass' },
    });

    fireEvent.click(screen.getByText(/Sign In/i));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass',
      });
      expect(handleClose).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });

  test('shows error on failed login', async () => {
    authService.login.mockRejectedValue({ message: 'Invalid credentials' });

    render(
      <MemoryRouter>
        <LoginPage open={true} handleClose={handleClose} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'wronguser' },
    });

    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByText(/Sign In/i));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});