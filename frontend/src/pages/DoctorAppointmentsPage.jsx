import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, CircularProgress, Alert, Divider, Button, TextField } from '@mui/material';
import { Cancel as CancelIcon, Videocam as VideocamIcon } from '@mui/icons-material';
import { authService } from '../services/api';
import { appointmentService } from '../services/appointmentService';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotesField, setShowNotesField] = useState({}); // State to toggle notes field for all appointments
  const [notes, setNotes] = useState({}); // State to manage notes for all appointments

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentService.getDoctorAppointments();
        setAppointments(response);

        const initialNotes = response.reduce((acc, appt) => {
          acc[appt.id] = appt.notes || ""; 
          return acc;
        }, {});
        setNotes(initialNotes)
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

  const handleSaveNotes = async (appointmentId) => {
    try {
      const appointment_notes = notes[appointmentId];
      await appointmentService.updateAppointmentNotes(appointmentId, appointment_notes);
      setAppointments(prevAppointments =>
        prevAppointments.map(appt =>
          appt.id === appointmentId ? { ...appt, notes: appointment_notes } : appt
        )
      );
      setShowNotesField(prev => ({ ...prev, [appointmentId]: false }));
    } catch (err) {
      console.error("Failed to save notes:", err);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await appointmentService.cancelAppointment(appointmentId);
      
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

  const isAppointmentEnded = (appointmentTime) => {
    const appointmentDateTime = new Date(`${appointmentTime.date}T${appointmentTime.time}`);
    const appointmentEndTime = new Date(appointmentDateTime.getTime() + 30 * 60000);
    return new Date() > appointmentEndTime;
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

      {!loading && appointments && appointments.length === 0 && (
        <Alert severity="info">
          You have no scheduled appointments.
        </Alert>
      )}

      {!loading && appointments && appointments.length > 0 && (
        <List>
          {appointments && appointments.map((appointment) => (
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
                    {appointment.meet_link && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<VideocamIcon />}
                        href={appointment.meet_link}
                        target="_blank"
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        Join Video Consultation
                      </Button>
                    )}
                  </>
                }
              />
              <IconButton 
                edge="end" 
                onClick={() => handleCancelAppointment(appointment.id)}
                disabled={appointment.status === 'Cancelled'}
                title="Cancel appointment"
                sx={{marginRight: "2px"}}
              >
                <CancelIcon color={appointment.status === 'Cancelled' ? 'disabled' : 'error'} />
              </IconButton>
              {isAppointmentEnded(appointment.appointment_time) && (
                <>
                  <Button variant="outlined" size="small" sx={{marginRight: "6px"}}>Upload files</Button>
                  {
                    appointment.notes ? 
                    <Button variant="outlined" size="small" sx={{marginRight: "6px"}} onClick={() => setShowNotesField(prev => ({ ...prev, [appointment.id]: true }))}>
                      Update Notes
                    </Button> :
                    <Button variant="outlined" size="small" sx={{marginRight: "6px"}} onClick={() => setShowNotesField(prev => ({ ...prev, [appointment.id]: true }))}>
                      Add Notes
                    </Button>
                  }
                  {!showNotesField[appointment.id] && appointment.notes &&
                    <Typography>{appointment.notes}</Typography>
                  }
                  {showNotesField[appointment.id] &&
                    <>
                      <TextField
                        value={notes[appointment.id] || ""}
                        onChange={(e) => setNotes(prev => ({ ...prev, [appointment.id]: e.target.value }))}
                        multiline
                        sx={{marginRight: "6px"}}
                      />
                      <Button 
                        variant="outlined"
                        size="small"
                        onClick={() => handleSaveNotes(appointment.id)}
                      >
                        Save
                      </Button>
                    </>
                  }
                </>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}