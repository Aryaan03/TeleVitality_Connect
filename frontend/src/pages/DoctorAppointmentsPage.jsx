import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Cancel as CancelIcon } from '@mui/icons-material';
import { authService } from '../services/api';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await authService.getDoctorAppointments(); // Add this in `api.js`
        setAppointments(response);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await authService.cancelAppointment(appointmentId); // Add this in `api.js`
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
