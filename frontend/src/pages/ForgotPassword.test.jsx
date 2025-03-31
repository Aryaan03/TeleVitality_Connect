import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPassword from './ForgotPassword';
import { BrowserRouter } from 'react-router-dom';
import { authService } from '../services/api';

jest.mock('../services/api', () => ({
  authService: {
    resetPassword: jest.fn(),
  },
}));

const renderComponent = () => {
  render(
    <BrowserRouter>
      <ForgotPassword />
    </BrowserRouter>
  );
};

describe('ForgotPassword Component', () => {
  test('renders form fields and submits successfully', async () => {
    authService.resetPassword.mockResolvedValueOnce(); // simulate success

    renderComponent();

    fireEvent.change(screen.getByLabelText((_, el) => el.id === 'email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText((_, el) => el.id === 'newPassword'), {
      target: { value: 'abc123' },
    });
    fireEvent.change(screen.getByLabelText((_, el) => el.id === 'confirmPassword'), {
      target: { value: 'abc123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith('test@example.com', 'abc123');
      expect(screen.getByText(/password reset successful/i)).toBeInTheDocument();
    });
  });

  test('shows error if passwords do not match', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText((_, el) => el.id === 'email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText((_, el) => el.id === 'newPassword'), {
      target: { value: 'abc123' },
    });
    fireEvent.change(screen.getByLabelText((_, el) => el.id === 'confirmPassword'), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
  });
});