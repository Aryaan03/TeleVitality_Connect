
import React from 'react';
import { render, screen } from '@testing-library/react';
import PatientRegisterPage from '../PatientRegisterPage';

describe('PatientRegisterPage', () => {
  const mockHandleClose = jest.fn();
  const mockOpenLogin = jest.fn();

  beforeEach(() => {
    render(<PatientRegisterPage open={true} handleClose={mockHandleClose} openLogin={mockOpenLogin} />);
  });

  test('renders registration form elements', () => {
    expect(screen.getByText('Patient Registration')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('shows validation errors when form is submitted empty', () => {
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
    expect(screen.getByText(/you must agree/i)).toBeInTheDocument();
  });

  test('validates email format and password length', () => {
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
  });
});
