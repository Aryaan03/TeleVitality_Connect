import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Cancel as CancelIcon } from '@mui/icons-material';
import { authService } from '../services/api';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const sampleAppointments = [
    { id: 1, patientName: 'Alice Smith', date: '2025-03-05', time: '10:00' },
    { id: 2, patientName: 'Bob Johnson', date: '2025-03-06', time: '14:30' },
    { id: 3, patientName: 'Charlie Brown', date: '2025-03-07', time: '09:15' },
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // const response = await authService.getDoctorAppointments(); // Add this in `api.js`
        // setAppointments(response);
        setAppointments(sampleAppointments);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      // await authService.cancelAppointment(appointmentId); // Add this in `api.js`
      setAppointments(appointments.filter((appt) => appt.id !== appointmentId));
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Scheduled Appointments
      </Typography>

      <List>
        {appointments.map((appointment) => (
          <ListItem key={appointment.id} divider>
            <ListItemText primary={`Patient Name: ${appointment.patientName}`} secondary={`Date & Time: ${appointment.date} ${appointment.time}`} />
            <IconButton edge="end" onClick={() => handleCancelAppointment(appointment.id)}>
              <CancelIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
