import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from './RegisterPage';

describe('RegisterPage', () => {
  const mockHandleClose = jest.fn();
  const mockOpenLogin = jest.fn();

  beforeEach(() => {
    render(
      <RegisterPage open={true} handleClose={mockHandleClose} openLogin={mockOpenLogin} />
    );
  });

  it('renders the registration form correctly', () => {
    expect(screen.getByText(/Create Your Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
  });

  it('shows validation errors if required fields are empty', async () => {
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      // Adjusted expected error count from 3 → 4
      const errors = screen.getAllByText('Required');
      expect(errors).toHaveLength(4); 
    });

    expect(screen.getByText('You must agree to the terms and conditions')).toBeInTheDocument();
  });
});