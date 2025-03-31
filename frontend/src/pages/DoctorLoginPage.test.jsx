import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DoctorLoginPage from './DoctorLoginPage';
import { MemoryRouter } from 'react-router-dom';
import { authService } from '../services/api';

jest.mock('../services/api');

describe('DoctorLoginPage', () => {
  const mockHandleClose = jest.fn();

  test('shows validation error on empty submit', async () => {
    render(
      <MemoryRouter>
        <DoctorLoginPage open={true} handleClose={mockHandleClose} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findAllByText(/required/i)).toHaveLength(2);
  });

  test('calls login API and navigates on success', async () => {
    authService.doclogin.mockResolvedValue({ token: 'mock-token' });

    render(
      <MemoryRouter>
        <DoctorLoginPage open={true} handleClose={mockHandleClose} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'docuser' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'pass1234' }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(authService.doclogin).toHaveBeenCalledWith({
        username: 'docuser',
        password: 'pass1234'
      });
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });

  test('displays error on login failure', async () => {
    authService.doclogin.mockRejectedValue(new Error('Login failed'));

    render(
      <MemoryRouter>
        <DoctorLoginPage open={true} handleClose={mockHandleClose} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'fail' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
  });
});