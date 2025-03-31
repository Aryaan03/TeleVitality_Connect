import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DoctorRegisterPage from './DoctorRegisterPage';
import { authService } from '../services/api';

jest.mock('../services/api');

describe('DoctorRegisterPage', () => {
  const mockHandleClose = jest.fn();
  const mockOpenLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows validation errors on empty submit', async () => {
    render(
      <DoctorRegisterPage open={true} handleClose={mockHandleClose} openLogin={mockOpenLogin} />
    );

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findAllByText(/required/i)).toBeTruthy();
  });

  test('shows password mismatch error', async () => {
    render(
      <DoctorRegisterPage open={true} handleClose={jest.fn()} openLogin={jest.fn()} />
    );
  
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'testpass' }
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'wrongpass' }
    });
  
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
  
    expect(await screen.findByText(/passwords must match/i)).toBeInTheDocument();
  });

  test('shows consent checkbox error', async () => {
    render(
      <DoctorRegisterPage open={true} handleClose={mockHandleClose} openLogin={mockOpenLogin} />
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'doc' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'doc@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'testpass123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'testpass123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/must agree to the terms/i)).toBeInTheDocument();
  });

  test('calls register API and switches to login', async () => {
    authService.docregister.mockResolvedValueOnce({});

    render(
      <DoctorRegisterPage open={true} handleClose={mockHandleClose} openLogin={mockOpenLogin} />
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'doc' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'doc@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'testpass123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'testpass123' } });

    fireEvent.click(screen.getByLabelText(/I agree to the terms/i));

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(authService.docregister).toHaveBeenCalled();
      expect(mockHandleClose).toHaveBeenCalled();
      expect(mockOpenLogin).toHaveBeenCalled();
    });
  });
});