import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'mockToken');
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  test('renders static content correctly', async () => {
    // Mock a successful API response
    axios.get.mockResolvedValueOnce({ data: { message: 'Welcome to Dashboard' } });
    
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Wait for loading to complete before making assertions
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    expect(screen.getByText(/Patient Dashboard/i)).toBeInTheDocument();
  });

  test('displays loading spinner while fetching data', async () => {
    // Mock a pending API call
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays message on successful API response', async () => {
    // Mock a successful API response
    axios.get.mockResolvedValueOnce({ data: { message: 'Welcome to Dashboard' } });
    
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Wait for loading to finish AND for the message to appear
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.getByText('Welcome to Dashboard')).toBeInTheDocument();
    });
  });

  test('navigates to login on unauthorized error', async () => {
    // Mock a 401 error
    axios.get.mockRejectedValueOnce({ response: { status: 401 } });
    
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Wait for both the state updates to complete
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
