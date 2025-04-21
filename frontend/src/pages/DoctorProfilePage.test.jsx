import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import DoctorProfilePage from './DoctorProfilePage';
import * as api from '../services/api';
import * as appointmentService from '../services/appointmentService';

// ✅ Mock calendar to avoid ESM parse errors
jest.mock('../components/DoctorAvailabilityCalendar', () => () => (
  <div>Mocked Calendar</div>
));

// ✅ Mock services
jest.mock('../services/api');
jest.mock('../services/appointmentService');

// ✅ Wrap with router and theme
const renderWithProviders = (ui) => {
  const theme = createTheme();
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>
  );
};

describe('DoctorProfilePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading spinner initially', async () => {
    api.authService.getDoctorProfile.mockResolvedValueOnce({});
    appointmentService.appointmentService.getSpecialties.mockResolvedValueOnce([]);

    renderWithProviders(<DoctorProfilePage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(api.authService.getDoctorProfile).toHaveBeenCalled();
    });
  });

  it('renders profile form with fetched values', async () => {
    const mockProfile = {
      firstName: 'Alice',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      gender: 'Female',
      phoneNumber: '1234567890',
      medicalLicenseNumber: 'ABC123',
      issuingMedicalBoard: 'XYZ Board',
      licenseExpiryDate: '2025-01-01T00:00:00.000Z',
      specialization: 'Cardiology',
      yearsOfExperience: 5,
      hospitalName: 'HealthCare Clinic',
      workAddress: '123 Main St',
      consultationType: 'Virtual',
      availability: JSON.stringify(JSON.stringify({}))
    };

    const mockSpecialties = [
      { id: 1, name: 'Cardiology' },
      { id: 2, name: 'Neurology' }
    ];

    api.authService.getDoctorProfile.mockResolvedValueOnce(mockProfile);
    appointmentService.appointmentService.getSpecialties.mockResolvedValueOnce(mockSpecialties);

    renderWithProviders(<DoctorProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
    });

    expect(screen.getByText(/Personal Information/i)).toBeInTheDocument();
    expect(screen.getByText(/Professional Details/i)).toBeInTheDocument();
    expect(screen.getByText(/License Information/i)).toBeInTheDocument();
    expect(screen.getByText(/Practice Details/i)).toBeInTheDocument();
    expect(screen.getByText(/^Availability$/i)).toBeInTheDocument();

  });

  it('shows error alert on failed profile fetch', async () => {
    api.authService.getDoctorProfile.mockRejectedValueOnce(new Error('Fetch error'));
    appointmentService.appointmentService.getSpecialties.mockResolvedValueOnce([]);

    renderWithProviders(<DoctorProfilePage />);

    await waitFor(() => {
      expect(screen.getByText(/Unable to load profile/i)).toBeInTheDocument();
    });
  });
});
