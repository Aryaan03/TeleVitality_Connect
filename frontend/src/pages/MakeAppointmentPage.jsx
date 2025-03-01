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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Avatar,
  Badge,
  IconButton
} from '@mui/material';
import { 
  Schedule as ScheduleIcon, 
  History as HistoryIcon,
  AttachFile as AttachFileIcon,
  ExpandMore as ExpandMoreIcon,
  MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
  },
  marginBottom: theme.spacing(4),
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [medicalFiles, setMedicalFiles] = useState([]);
  const [appointmentsHistory, setAppointmentsHistory] = useState(mockHistory);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ 
        fontWeight: 'bold', 
        mb: 4, 
        color: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <MedicalServicesIcon fontSize="large" />
        Medical Appointments
      </Typography>

      <StyledTabs value={activeTab} onChange={handleTabChange}>
        <StyledTab 
          label="Schedule Appointment" 
          icon={<ScheduleIcon />} 
          iconPosition="start"
        />
        <StyledTab 
          label={
            <Badge badgeContent={appointmentsHistory.length} color="primary">
              Appointment History
            </Badge>
          } 
          icon={<HistoryIcon />} 
          iconPosition="start"
        />
      </StyledTabs>

      {activeTab === 0 && (
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ 
            fontWeight: 'bold', 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <ScheduleIcon fontSize="large" />
            New Appointment
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Medical Specialty</InputLabel>
            <Select
              value={selectedSpecialty}
              onChange={handleSpecialtyChange}
              label="Medical Specialty"
            >
              <MenuItem value=""><em>Select Specialty</em></MenuItem>
              {mockSpecialties.map((spec) => (
                <MenuItem key={spec.id} value={spec.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: 'primary.main', 
                      width: 32, 
                      height: 32,
                      fontSize: '0.875rem'
                    }}>
                      {spec.name[0]}
                    </Avatar>
                    {spec.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }} disabled={!selectedSpecialty}>
            <InputLabel>Select Doctor</InputLabel>
            <Select
              value={selectedDoctor}
              onChange={handleDoctorChange}
              label="Select Doctor"
            >
              <MenuItem value=""><em>Available Doctors</em></MenuItem>
              {doctorsForSelectedSpecialty.map((doc) => (
                <MenuItem key={doc.id} value={doc.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>{doc.name[0]}</Avatar>
                    <Box>
                      <Typography>{doc.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {doc.qualifications} • {doc.experience} experience
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }} disabled={!selectedDoctor}>
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

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Describe Your Problem"
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            variant="outlined"
            component="label"
            startIcon={<AttachFileIcon />}
            sx={{ mb: 3 }}
          >
            Upload Medical Reports
            <input
              type="file"
              hidden
              multiple
              onChange={handleFileUpload}
            />
          </Button>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleBookAppointment}
            sx={{ py: 1.5, fontWeight: 'bold' }}
          >
            Confirm Appointment
          </Button>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ 
            fontWeight: 'bold', 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <HistoryIcon fontSize="large" />
            Appointment History
          </Typography>

          {appointmentsHistory.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No appointment history found
            </Typography>
          ) : (
            <List sx={{ width: '100%' }}>
              {appointmentsHistory.map((appointment) => (
                <Paper key={appointment.id} elevation={2} sx={{ mb: 2, borderRadius: 2 }}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="h6">
                          {new Date(appointment.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {appointment.doctor}
                          </Typography>
                          <Typography variant="body2">
                            {appointment.specialty}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip 
                      label={appointment.status} 
                      color={appointment.status === 'Completed' ? 'success' : 'warning'}
                      sx={{ fontWeight: 'bold' }}
                    />
                    <IconButton>
                      <ExpandMoreIcon />
                    </IconButton>
                  </ListItem>
                  
                  <Divider />
                  
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Problem:</strong> {appointment.problem || 'Not specified'}
                    </Typography>
                    {appointment.prescription && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Prescription:</strong> {appointment.prescription}
                      </Typography>
                    )}
                    {appointment.files?.length > 0 && (
                      <Typography variant="body2">
                        <strong>Attachments:</strong> {appointment.files.length} file(s)
                      </Typography>
                    )}
                  </Box>
                </Paper>
              ))}
            </List>
          )}
        </Paper>
      )}
    </Container>
  );
}