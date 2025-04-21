import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage'; // Adjust the path if needed

describe('HomePage Component', () => {
  test('renders hero section with correct headings and buttons', () => {
    render(<HomePage onGetStartedClick={jest.fn()} onLoginClick={jest.fn()} />);

    // Use a function matcher for broken-up heading
    expect(
      screen.getByText((content, element) =>
        element.tagName.toLowerCase() === 'h1' &&
        content.includes('Telemedicine that') &&
        element.textContent.includes('puts patients first')
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Streamline your practice with our secure, intuitive telehealth platform/i)
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /start free trial/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /watch demo/i })).toBeInTheDocument();
  });

  test('renders stats section with correct values', () => {
    render(<HomePage onGetStartedClick={jest.fn()} onLoginClick={jest.fn()} />);

    expect(screen.getByText('94.5%')).toBeInTheDocument();
    expect(screen.getByText(/Patient Satisfaction/i)).toBeInTheDocument();
    expect(screen.getByText('10K+')).toBeInTheDocument();
    expect(screen.getByText(/Consultations Monthly/i)).toBeInTheDocument();
    expect(screen.getByText('450+')).toBeInTheDocument();

    // Use getAllByText to handle multiple similar values
    expect(screen.getAllByText(/Healthcare Providers/i).length).toBeGreaterThan(0);
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText(/Medical Specialties/i)).toBeInTheDocument();
  });

  test('renders footer content', () => {
    render(<HomePage onGetStartedClick={jest.fn()} onLoginClick={jest.fn()} />);

    expect(screen.getAllByText(/TeleVitality/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/© 2025 TeleVitality/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
  });
});
