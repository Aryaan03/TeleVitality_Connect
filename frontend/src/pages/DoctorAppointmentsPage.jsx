import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, CircularProgress, Alert } from '@mui/material';
import { Cancel as CancelIcon } from '@mui/icons-material';
import { authService } from '../services/api';
import { appointmentService } from '../services/appointmentService';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentService.getDoctorAppointments();
        setAppointments(response);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await appointmentService.cancelAppointment(appointmentId);
      
      // Update the appointment status in the state instead of removing it
      setAppointments(prevAppointments => 
        prevAppointments.map(appt => 
          appt.id === appointmentId ? { ...appt, status: 'Cancelled' } : appt
        )
      );
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      setError('Failed to cancel appointment. Please try again.');
    }
  };

  // Format date and time for display
  const formatDateTime = (appointmentTime) => {
    if (!appointmentTime) return 'N/A';

    try {
      const date = appointmentTime.date || 'N/A';
      const time = appointmentTime.time || 'N/A';
      return `${date} at ${time}`;
    } catch (error) {
      console.error('Error formatting date time:', error);
      return 'Invalid date/time';
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Scheduled Appointments
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && appointments.length === 0 && (
        <Alert severity="info">
          You have no scheduled appointments.
        </Alert>
      )}

      {!loading && appointments.length > 0 && (
        <List>
          {appointments.map((appointment) => (
            <ListItem key={appointment.id} divider>
              <ListItemText 
                primary={`Patient: ${appointment.patient_name || 'N/A'}`} 
                secondary={
                  <>
                    <Typography component="span" variant="body2" display="block">
                      Date & Time: {formatDateTime(appointment.appointment_time)}
                    </Typography>
                    {appointment.problem_description && (
                      <Typography component="span" variant="body2" display="block">
                        Problem: {appointment.problem_description}
                      </Typography>
                    )}
                    <Typography component="span" variant="body2" display="block">
                      Status: {appointment.status || 'Scheduled'}
                    </Typography>
                  </>
                }
              />
              <IconButton 
                edge="end" 
                onClick={() => handleCancelAppointment(appointment.id)}
                disabled={appointment.status === 'Cancelled'}
                title="Cancel appointment"
              >
                <CancelIcon color={appointment.status === 'Cancelled' ? 'disabled' : 'error'} />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}