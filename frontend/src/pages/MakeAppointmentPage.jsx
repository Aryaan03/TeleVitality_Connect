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
  Paper,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import HistoryIcon from '@mui/icons-material/History';

// Mock data
const mockSpecialties = [
  { id: 'cardiology', name: 'Cardiology' },
  { id: 'dermatology', name: 'Dermatology' },
  { id: 'pediatrics', name: 'Pediatrics' },
];

const mockDoctors = {
  cardiology: [
    { id: 'doc1', name: 'Dr. Heart', experience: '10 years', qualifications: 'MD, Cardiology' },
    { id: 'doc2', name: 'Dr. Aorta', experience: '8 years', qualifications: 'MD, FACC' },
  ],
  dermatology: [
    { id: 'doc3', name: 'Dr. Skin', experience: '12 years', qualifications: 'MD, Dermatology' },
    { id: 'doc4', name: 'Dr. Derm', experience: '6 years', qualifications: 'MD, Cosmetic Dermatology' },
  ],
  pediatrics: [
    { id: 'doc5', name: 'Dr. Kid', experience: '15 years', qualifications: 'MD, Pediatrics' },
    { id: 'doc6', name: 'Dr. Child', experience: '7 years', qualifications: 'MD, Child Nutrition' },
  ],
};

const mockSlots = {
  doc1: ['2025-03-01T10:00', '2025-03-01T11:00'],
  doc2: ['2025-03-02T09:30', '2025-03-02T13:00'],
  doc3: ['2025-03-03T08:00', '2025-03-03T10:30'],
  doc4: ['2025-03-04T14:00', '2025-03-04T15:30'],
  doc5: ['2025-03-05T09:00', '2025-03-05T11:00'],
  doc6: ['2025-03-06T10:00', '2025-03-06T12:00'],
};

const mockHistory = [
  {
    id: 1,
    date: '2024-03-15T10:00',
    doctor: 'Dr. Heart',
    specialty: 'Cardiology',
    problem: 'Chest pain consultation',
    prescription: 'Prescribed ECG and blood tests',
    status: 'Completed'
  },
];

export default function AppointmentsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [medicalFiles, setMedicalFiles] = useState([]);
  const [appointmentsHistory, setAppointmentsHistory] = useState(mockHistory);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add missing handlers
  const handleSpecialtyChange = (event) => {
    setSelectedSpecialty(event.target.value);
    setSelectedDoctor('');
    setSelectedSlot('');
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
    setSelectedSlot('');
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setMedicalFiles(files);
  };

  const handleBookAppointment = () => {
    setError('');
    setSuccess('');

    if (!selectedSpecialty || !selectedDoctor || !selectedSlot) {
      setError('Please select specialty, doctor, and time slot.');
      return;
    }

    const newAppointment = {
      id: appointmentsHistory.length + 1,
      date: selectedSlot,
      doctor: mockDoctors[selectedSpecialty].find(d => d.id === selectedDoctor).name,
      specialty: mockSpecialties.find(s => s.id === selectedSpecialty).name,
      problem: problemDescription,
      status: 'Upcoming',
      files: medicalFiles
    };

    setAppointmentsHistory([...appointmentsHistory, newAppointment]);
    setSuccess(`Appointment booked for ${new Date(selectedSlot).toLocaleString()}`);
    resetForm();
  };

  const resetForm = () => {
    setSelectedSpecialty('');
    setSelectedDoctor('');
    setSelectedSlot('');
    setProblemDescription('');
    setMedicalFiles([]);
  };

  const doctorsForSelectedSpecialty = selectedSpecialty ? mockDoctors[selectedSpecialty] : [];
  const slotsForSelectedDoctor = selectedDoctor ? mockSlots[selectedDoctor] : [];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Appointment Booking Section */}
      <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          <AttachFileIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          New Appointment
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Specialty Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Medical Specialty</InputLabel>
          <Select
            value={selectedSpecialty}
            onChange={handleSpecialtyChange}
            label="Medical Specialty"
          >
            <MenuItem value=""><em>Select Specialty</em></MenuItem>
            {mockSpecialties.map((spec) => (
              <MenuItem key={spec.id} value={spec.id}>{spec.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Doctor Selection */}
        <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedSpecialty}>
          <InputLabel>Select Doctor</InputLabel>
          <Select
            value={selectedDoctor}
            onChange={handleDoctorChange}
            label="Select Doctor"
          >
            <MenuItem value=""><em>Available Doctors</em></MenuItem>
            {doctorsForSelectedSpecialty.map((doc) => (
              <MenuItem key={doc.id} value={doc.id}>
                <Box>
                  <Typography>{doc.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {doc.qualifications} | {doc.experience} experience
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Time Slot Selection */}
        <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedDoctor}>
          <InputLabel>Available Time Slots</InputLabel>
          <Select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            label="Available Time Slots"
          >
            <MenuItem value=""><em>Select Time Slot</em></MenuItem>
            {slotsForSelectedDoctor.map((slot) => (
              <MenuItem key={slot} value={slot}>
                {new Date(slot).toLocaleString()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Problem Description */}
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Describe Your Problem"
          value={problemDescription}
          onChange={(e) => setProblemDescription(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* File Upload */}
        <Button
          variant="outlined"
          component="label"
          startIcon={<AttachFileIcon />}
          sx={{ mb: 2 }}
        >
          Upload Medical Reports
          <input
            type="file"
            hidden
            multiple
            onChange={handleFileUpload}
          />
        </Button>
        {medicalFiles.length > 0 && (
          <Typography variant="caption" sx={{ ml: 2 }}>
            {medicalFiles.length} file(s) selected
          </Typography>
        )}

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleBookAppointment}
          sx={{ mt: 2, py: 1.5 }}
        >
          Confirm Appointment
        </Button>
      </Paper>

      {/* Appointment History Section */}
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Appointment History
        </Typography>

        {appointmentsHistory.length === 0 ? (
          <Typography color="text.secondary">No previous appointments found</Typography>
        ) : (
          <List>
            {appointmentsHistory.map((appointment) => (
              <Accordion key={appointment.id} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>
                      {new Date(appointment.date).toLocaleDateString()} - {appointment.doctor}
                    </Typography>
                    <Chip 
                      label={appointment.status} 
                      color={appointment.status === 'Completed' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Specialty"
                        secondary={appointment.specialty}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Problem Description"
                        secondary={appointment.problem || 'Not specified'}
                      />
                    </ListItem>
                    <Divider />
                    {appointment.prescription && (
                      <>
                        <ListItem>
                          <ListItemText
                            primary="Prescription"
                            secondary={appointment.prescription}
                          />
                        </ListItem>
                        <Divider />
                      </>
                    )}
                    {appointment.files && appointment.files.length > 0 && (
                      <ListItem>
                        <ListItemText
                          primary="Attached Files"
                          secondary={`${appointment.files.length} medical reports`}
                        />
                      </ListItem>
                    )}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}