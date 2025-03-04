import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../LoginPage';
import { BrowserRouter } from 'react-router-dom';

describe('LoginPage', () => {
  const mockHandleClose = jest.fn();

  beforeEach(() => {
    render(
      <BrowserRouter>
        <LoginPage open={true} handleClose={mockHandleClose} />
      </BrowserRouter>
    );
  });

  test('renders login form', () => {
    expect(screen.getByText('Patient Login')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('displays validation errors for empty fields', () => {
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  test('clicking "Forgot Password" triggers alert', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    fireEvent.click(screen.getByText('Forgot Password?'));
    expect(alertMock).toHaveBeenCalledWith('Forgot Password clicked!');
    alertMock.mockRestore();
  });
});
