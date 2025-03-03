import React, { useState, useEffect } from 'react';
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
  IconButton,
  CircularProgress
} from '@mui/material';
import { 
  Schedule as ScheduleIcon, 
  History as HistoryIcon,
  AttachFile as AttachFileIcon,
  ExpandMore as ExpandMoreIcon,
  MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { appointmentService } from '../services/appointmentService';

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
  const [appointmentsHistory, setAppointmentsHistory] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [medicalFiles, setMedicalFiles] = useState([]);
  
  // State for data from API
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]); // Initialize as an empty array
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState({
    specialties: false,
    doctors: false,
    slots: false,
    booking: false
  });

  

  // Fetch specialties on component mount
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setLoading(prev => ({ ...prev, specialties: true }));
        const data = await appointmentService.getSpecialties();
        setSpecialties(data);
      } catch (err) {
        setError('Failed to load specialties. Please try again later.');
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, specialties: false }));
      }
    };

    fetchSpecialties();
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      const fetchAppointmentHistory = async () => {
        try {
          const data = await appointmentService.getAppointmentHistory();
          setAppointmentsHistory(data);
        } catch (err) {
          setError('Failed to load appointment history. Please try again later.');
          console.error(err);
        }
      };
  
      fetchAppointmentHistory();
    }
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSpecialtyChange = async (event) => {
    const specialtyId = event.target.value;
    console.log("Selected Specialty ID:", specialtyId); // Log the selected specialty
    setSelectedSpecialty(specialtyId);
    setSelectedDoctor('');
    setSelectedSlot('');
    setAvailableSlots([]);
  
    if (specialtyId) {
      try {
        setLoading(prev => ({ ...prev, doctors: true }));
        const doctorsData = await appointmentService.getDoctorsBySpecialty(specialtyId);
        console.log('Doctors Data:', doctorsData); // Log the response
        setDoctors(doctorsData || []);
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
        console.error(err);
        setDoctors([]);
      } finally {
        setLoading(prev => ({ ...prev, doctors: false }));
      }
    } else {
      setDoctors([]);
    }
  };

  const handleDoctorChange = async (event) => {
    const doctorId = event.target.value;
    setSelectedDoctor(doctorId);
    setSelectedSlot('');
    
    if (doctorId) {
      try {
        setLoading(prev => ({ ...prev, slots: true }));
        const availabilityData = await appointmentService.getDoctorAvailability(doctorId);
        
        // Process availability data into 30-minute slots
        const slots = processAvailabilityIntoTimeSlots(availabilityData);
        setAvailableSlots(slots);
      } catch (err) {
        setError('Failed to load available time slots. Please try again later.');
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, slots: false }));
      }
    }
  };

  // Function to process doctor availability JSON into 30-minute time slots
  const processAvailabilityIntoTimeSlots = (availabilityData) => {
    const slots = [];
    const currentDate = new Date();
    const nextTwoWeeks = new Date(currentDate);
    nextTwoWeeks.setDate(nextTwoWeeks.getDate() + 14);
  
    // Parse the availability JSON
    let availability;
    try {
      availability = typeof availabilityData === 'string' 
        ? JSON.parse(availabilityData) 
        : availabilityData;
    } catch (e) {
      console.error("Error parsing availability data:", e);
      return [];
    }
  
    // Get day names (Monday, Tuesday, etc.)
    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", 
      "Thursday", "Friday", "Saturday"
    ];
  
    // Loop through the next 14 days
    for (let d = 0; d < 14; d++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + d);
      const dayName = days[date.getDay()];
  
      // Skip if this day isn't enabled in doctor's availability
      if (!availability[dayName] || !availability[dayName].enabled) {
        continue;
      }
  
      // Process each enabled time slot for the day
      availability[dayName].timeSlots.forEach(slot => {
        if (!slot.enabled) return;
  
        // Convert slot times to minutes since midnight
        const [startHour, startMinute] = slot.startTime.split(':').map(Number);
        const [endHour, endMinute] = slot.endTime.split(':').map(Number);
  
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
  
        // Create 30-minute intervals
        for (let time = startMinutes; time < endMinutes; time += 30) {
          const hour = Math.floor(time / 60);
          const minute = time % 60;
  
          const appointmentDate = new Date(date);
          appointmentDate.setHours(hour, minute, 0, 0);
  
          // Skip times in the past
          if (appointmentDate <= new Date()) {
            continue;
          }
  
          slots.push({
            id: `${appointmentDate.toISOString()}`,
            dateTime: appointmentDate,
            formattedDateTime: formatDateTime(appointmentDate)
          });
        }
      });
    }
  
    return slots.sort((a, b) => a.dateTime - b.dateTime);
  };
  
  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setMedicalFiles(files);
  };

  const handleBookAppointment = async () => {
    setError('');
    setSuccess('');
  
    if (!selectedSpecialty || !selectedDoctor || !selectedSlot) {
      setError('Please select specialty, doctor, and time slot.');
      return;
    }
  
    // Convert the selected slot to UTC
    const selectedDate = new Date(selectedSlot);
    const utcDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
  
    // Format the selectedSlot as a JSON object
    const appointmentTime = {
      date: utcDate.toISOString().split('T')[0], // Date part (YYYY-MM-DD)
      time: utcDate.toISOString().split('T')[1].split('.')[0], // Time part (HH:MM:SS)
    };
  
    const formData = new FormData();
    formData.append('doctorId', selectedDoctor);
    formData.append('appointmentTime', JSON.stringify(appointmentTime));
    formData.append('problem', problemDescription);
  
    // Append each file to the FormData object
    medicalFiles.forEach((file, index) => {
      formData.append(`files`, file);
    });
  
    console.log("Appointment Data:", formData);
  
    try {
      setLoading(prev => ({ ...prev, booking: true }));
      const response = await appointmentService.bookAppointment(formData);
      setSuccess(`Appointment booked successfully for ${formatDateTime(new Date(selectedSlot))}`);
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to book appointment. Please try again.');
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, booking: false }));
    }
  };

  const resetForm = () => {
    setSelectedSpecialty('');
    setSelectedDoctor('');
    setSelectedSlot('');
    setProblemDescription('');
    setMedicalFiles([]);
  };

  // New function to correctly format appointment dates from the history
  const formatAppointmentDateTime = (appointment) => {
    if (!appointment.appointment_time) return 'Invalid date';
    
    try {
      // Construct a proper date string with both date and time
      const dateStr = appointment.appointment_time.date;
      const timeStr = appointment.appointment_time.time;
      
      // Create a date object and adjust for timezone
      const dateObj = new Date(`${dateStr}T${timeStr}`);
      
      // Format the date and time
      return dateObj.toLocaleString('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (err) {
      console.error("Error formatting appointment date:", err);
      return 'Invalid date format';
    }
  };

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
              disabled={loading.specialties}
            >
              <MenuItem value=""><em>Select Specialty</em></MenuItem>
              {loading.specialties ? (
                <MenuItem disabled><CircularProgress size={20} /> Loading...</MenuItem>
              ) : specialties.map((spec) => (
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

          <FormControl fullWidth sx={{ mb: 3 }} disabled={!selectedSpecialty || loading.doctors}>
            <InputLabel>Select Doctor</InputLabel>
            <Select
              value={selectedDoctor}
              onChange={handleDoctorChange}
              label="Select Doctor"
            >
              <MenuItem value=""><em>Available Doctors</em></MenuItem>
              {loading.doctors ? (
                <MenuItem disabled><CircularProgress size={20} /> Loading...</MenuItem>
              ) : doctors.length === 0 ? (
                <MenuItem disabled>No doctors available</MenuItem>
              ) : (
                doctors.map((doc) => (
                  <MenuItem key={doc.userId} value={doc.userId}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {doc.firstName ? doc.firstName[0] : 'D'}
                      </Avatar>
                      <Box>
                        <Typography>Dr. {doc.firstName} {doc.lastName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {doc.specialization} • {doc.years_of_experience} years experience
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }} disabled={!selectedDoctor || loading.slots}>
            <InputLabel>Available Time Slots</InputLabel>
            <Select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              label="Available Time Slots"
            >
              <MenuItem value=""><em>Select Time Slot</em></MenuItem>
              {loading.slots ? (
                <MenuItem disabled><CircularProgress size={20} /> Loading...</MenuItem>
              ) : availableSlots.length === 0 ? (
                <MenuItem disabled>No available slots</MenuItem>
              ) : (
                availableSlots.map((slot) => (
                  <MenuItem key={slot.id} value={slot.id}>
                    {slot.formattedDateTime}
                  </MenuItem>
                ))
              )}
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
            disabled={!selectedSpecialty || !selectedDoctor || !selectedSlot || loading.booking}
            sx={{ py: 1.5, fontWeight: 'bold' }}
          >
            {loading.booking ? <CircularProgress size={24} color="inherit" /> : "Confirm Appointment"}
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
                          {formatAppointmentDateTime(appointment)}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Dr. {appointment.doctor_name}
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
                      <strong>Problem:</strong> {appointment.problem_description || 'Not specified'}
                    </Typography>
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