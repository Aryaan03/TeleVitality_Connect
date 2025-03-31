import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProfileDisplay from './ProfileDisplay';
import { BrowserRouter } from 'react-router-dom';
import * as api from '../services/api';

jest.mock('../services/api', () => ({
  authService: {
    getProfile: jest.fn(),
  },
}));

const mockProfile = {
  id: '12345',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  gender: 'Male',
  insuranceProvider: 'HealthSafe',
  insurancePolicyNumber: 'POL123456',
  phoneNumber: '123-456-7890',
  address: '123 Main St, Springfield',
  preferredCommunication: 'Email',
  problemDescription: 'Asthma and allergy issues.',
  preferredDoctor: 'Dr. Smith',
  consentTelemedicine: true,
};

describe('ProfileDisplay', () => {
  it('renders profile data correctly', async () => {
    api.authService.getProfile.mockResolvedValueOnce(mockProfile);

    render(
      <BrowserRouter>
        <ProfileDisplay />
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText(/#12345/)).toBeInTheDocument();
      expect(screen.getByText(/Asthma and allergy issues/i)).toBeInTheDocument();
      expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();
    });
  });

  it('displays error message when profile load fails', async () => {
    api.authService.getProfile.mockRejectedValueOnce(new Error('API error'));

    render(
      <BrowserRouter>
        <ProfileDisplay />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load profile data/i)).toBeInTheDocument();
    });
  });
});