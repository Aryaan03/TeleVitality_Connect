import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPassword from './ForgotPassword';
import { BrowserRouter } from 'react-router-dom';

// Mock the API service
jest.mock('../services/api', () => ({
  authService: {
    forgotPassword: jest.fn(() => Promise.resolve({ message: 'Code sent' })),
    verifyResetCode: jest.fn(() => Promise.resolve({ reset_token: 'fake_token' })),
    resetPassword: jest.fn(() => Promise.resolve({ message: 'Password updated' })),
    resetPasswordDoc: jest.fn(() => Promise.resolve({ message: 'Password updated' }))
  }
}));

const renderComponent = (props = {}) => {
  render(
    <BrowserRouter>
      <ForgotPassword
        open={true}
        handleClose={jest.fn()}
        openLogin={jest.fn()}
        openDoctorLogin={jest.fn()}
        userType="patient"
        {...props}
      />
    </BrowserRouter>
  );
};

describe('ForgotPassword Component', () => {
  test('renders email form and submits it', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitBtn = screen.getByRole('button', { name: /send verification code/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByLabelText(/verification code/i)).toBeInTheDocument();
    });
  });

  test('renders otp form and submits password reset', async () => {
    renderComponent();

    // Simulate first step
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send verification code/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/verification code/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/verification code/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'newPass123' } });

    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.queryByText(/check your email for the verification code/i)).toBeInTheDocument();
    });
  });
});
