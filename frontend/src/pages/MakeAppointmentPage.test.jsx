// AppointmentsPage.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppointmentsPage from './MakeAppointmentPage';
import * as appointmentService from '../services/appointmentService';

jest.mock('../services/appointmentService', () => ({
  getSpecialties: jest.fn().mockResolvedValue([]),
  getAppointmentHistory: jest.fn().mockResolvedValue([]),
  getDoctorsBySpecialty: jest.fn().mockResolvedValue([]),
  getDoctorAvailability: jest.fn().mockResolvedValue({}),
  getDoctorAppointmentTimes: jest.fn().mockResolvedValue({ appointment_times: [] }),
  bookAppointment: jest.fn().mockResolvedValue({}),
}));

describe('AppointmentsPage', () => {
  it('renders without crashing', async () => {
    render(<AppointmentsPage />);
    expect(await screen.findByText(/Medical Appointments/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Schedule Appointment/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Appointment History/i })).toBeInTheDocument();
  });

  it('switches tabs correctly', () => {
    render(<AppointmentsPage />);
    const historyTab = screen.getByRole('tab', { name: /Appointment History/i });
    fireEvent.click(historyTab);
    expect(historyTab).toHaveAttribute('aria-selected', 'true');
  });
});