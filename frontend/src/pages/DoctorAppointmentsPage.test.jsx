import { render, screen, waitFor } from '@testing-library/react';
import DoctorAppointmentsPage from './DoctorAppointmentsPage';
import { appointmentService } from '../services/appointmentService';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../services/appointmentService');

describe('DoctorAppointmentsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    appointmentService.getDoctorAppointments.mockResolvedValue([
      {
        id: '1',
        patient_name: 'John Doe',
        appointment_time: {
          date: '2025-04-10',
          time: '10:00',
        },
        status: 'Scheduled',
        problem_description: 'Back pain',
        notes: 'Checkup',
        files: [],
      }
    ]);
  });

  test('renders a doctor appointment', async () => {
    render(
      <MemoryRouter>
        <DoctorAppointmentsPage />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Back pain/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Scheduled/i).length).toBeGreaterThan(0);
    });
  });
});