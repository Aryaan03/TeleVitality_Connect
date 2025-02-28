// src/pages/AppointmentsPage.jsx

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Alert,
  Container,
  Paper
} from '@mui/material';

// Mock data for demonstration only
const mockSpecialties = [
  { id: 'cardiology', name: 'Cardiology' },
  { id: 'dermatology', name: 'Dermatology' },
  { id: 'pediatrics', name: 'Pediatrics' },
];

const mockDoctors = {
  cardiology: [
    { id: 'doc1', name: 'Dr. Heart' },
    { id: 'doc2', name: 'Dr. Aorta' },
  ],
  dermatology: [
    { id: 'doc3', name: 'Dr. Skin' },
    { id: 'doc4', name: 'Dr. Derm' },
  ],
  pediatrics: [
    { id: 'doc5', name: 'Dr. Kid' },
    { id: 'doc6', name: 'Dr. Child' },
  ],
};

const mockSlots = {
  doc1: ['2025-03-01 10:00', '2025-03-01 11:00'],
  doc2: ['2025-03-02 09:30', '2025-03-02 13:00'],
  doc3: ['2025-03-03 08:00', '2025-03-03 10:30'],
  doc4: ['2025-03-04 14:00', '2025-03-04 15:30'],
  doc5: ['2025-03-05 09:00', '2025-03-05 11:00'],
  doc6: ['2025-03-06 10:00', '2025-03-06 12:00'],
};

export default function AppointmentsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handler for specialty change
  const handleSpecialtyChange = (event) => {
    setSelectedSpecialty(event.target.value);
    // Reset doctor & slot when specialty changes
    setSelectedDoctor('');
    setSelectedSlot('');
    setError('');
    setSuccess('');
  };

  // Handler for doctor change
  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
    // Reset slot
    setSelectedSlot('');
    setError('');
    setSuccess('');
  };

  // Book appointment
  const handleBookAppointment = () => {
    setError('');
    setSuccess('');

    if (!selectedSpecialty || !selectedDoctor || !selectedSlot) {
      setError('Please select specialty, doctor, and time slot.');
      return;
    }

    // Since there's no backend, we'll just show a success message
    setSuccess(`Appointment booked with ${selectedDoctor} on ${selectedSlot}!`);
  };

  // Filter doctors based on selected specialty
  const doctorsForSelectedSpecialty = selectedSpecialty 
    ? mockDoctors[selectedSpecialty] 
    : [];

  // Filter slots based on selected doctor
  const slotsForSelectedDoctor = selectedDoctor 
    ? mockSlots[selectedDoctor] 
    : [];

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={4} 
        sx={{ 
          p: 4, 
          mt: 8, 
          borderRadius: 2, 
          background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          align="center" 
          sx={{ fontWeight: 'bold', mb: 3 }}
        >
          Make an Appointment
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Specialty */}
        <FormControl variant="outlined" fullWidth sx={{ mt: 2 }}>
          <InputLabel id="specialty-label">Specialty</InputLabel>
          <Select
            labelId="specialty-label"
            value={selectedSpecialty}
            label="Specialty"
            onChange={handleSpecialtyChange}
          >
            <MenuItem value="">
              <em>-- Select Specialty --</em>
            </MenuItem>
            {mockSpecialties.map((spec) => (
              <MenuItem key={spec.id} value={spec.id}>
                {spec.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Doctor */}
        <FormControl 
          variant="outlined" 
          fullWidth 
          sx={{ mt: 2 }} 
          disabled={!selectedSpecialty}
        >
          <InputLabel id="doctor-label">Doctor</InputLabel>
          <Select
            labelId="doctor-label"
            value={selectedDoctor}
            label="Doctor"
            onChange={handleDoctorChange}
          >
            <MenuItem value="">
              <em>-- Select Doctor --</em>
            </MenuItem>
            {doctorsForSelectedSpecialty.map((doc) => (
              <MenuItem key={doc.id} value={doc.id}>
                {doc.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Time Slot */}
        <FormControl 
          variant="outlined" 
          fullWidth 
          sx={{ mt: 2 }} 
          disabled={!selectedDoctor}
        >
          <InputLabel id="slot-label">Time Slot</InputLabel>
          <Select
            labelId="slot-label"
            value={selectedSlot}
            label="Time Slot"
            onChange={(e) => setSelectedSlot(e.target.value)}
          >
            <MenuItem value="">
              <em>-- Select Time --</em>
            </MenuItem>
            {slotsForSelectedDoctor.map((slot) => (
              <MenuItem key={slot} value={slot}>
                {slot}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5, fontSize: '1rem' }}
          onClick={handleBookAppointment}
        >
          Book Appointment
        </Button>
      </Paper>
    </Container>
  );
}
