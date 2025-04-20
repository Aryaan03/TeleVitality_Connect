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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  Schedule as ScheduleIcon, 
  History as HistoryIcon,
  AttachFile as AttachFileIcon,
  ExpandMore as ExpandMoreIcon,
  MedicalServices as MedicalServicesIcon,
  Videocam as VideocamIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  EventAvailable as EventAvailableIcon,
  Star as StarIcon,
  Work as WorkIcon,
  ScheduleSend as ScheduleSendIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { appointmentService } from '../services/appointmentService';
import { format, parseISO, isBefore, addDays } from 'date-fns';

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
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.primary,
  minHeight: 48,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const ProfessionalAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(6),
  height: theme.spacing(6),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  marginRight: theme.spacing(2),
}));

const TimeSlotButton = styled(Button)(({ theme, selected }) => ({
  minWidth: 100,
  margin: theme.spacing(0.5),
  fontWeight: selected ? theme.typography.fontWeightBold : theme.typography.fontWeightRegular,
  backgroundColor: selected ? theme.palette.primary.main : theme.palette.background.paper,
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : theme.palette.action.hover,
  },
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
}));

const FilePreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

function TimeSlotCalendar({ availableSlots, selectedSlot, onSelect }) {
  const theme = useTheme();
  
  const groupedSlots = availableSlots.reduce((acc, slot) => {
    const dateKey = slot.dateTime.toISOString().split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {});
  
  const sortedDates = Object.keys(groupedSlots).sort();

  return (
    <Box>
      {sortedDates.map(date => (
        <Box key={date} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ 
            mb: 2, 
            fontWeight: 'bold',
            color: theme.palette.text.secondary,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <CalendarIcon fontSize="small" />
            {new Date(date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {groupedSlots[date].map(slot => (
              <TimeSlotButton
                key={slot.id}
                variant={selectedSlot === slot.id ? 'contained' : 'outlined'}
                selected={selectedSlot === slot.id}
                onClick={() => onSelect(slot.id)}
                startIcon={<TimeIcon fontSize="small" />}
              >
                {new Date(slot.id).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit', 
                  hour12: true 
                })}
              </TimeSlotButton>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default function AppointmentsPage() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [appointmentStatusTab, setAppointmentStatusTab] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [appointmentsHistory, setAppointmentsHistory] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [medicalFiles, setMedicalFiles] = useState([]);
  const [expandedAppointments, setExpandedAppointments] = useState(new Set());
  const [previewFile, setPreviewFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState({
    specialties: false,
    doctors: false,
    slots: false,
    booking: false,
    history: false
  });

  const steps = ['Select Specialty', 'Choose Doctor', 'Pick Time Slot', 'Confirm Details'];

  // Group appointments by status
  const groupedAppointments = appointmentsHistory.reduce((acc, appointment) => {
    const status = appointment.status || 'Scheduled';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(appointment);
    return acc;
  }, {});

  // Sort appointments within each group by date and time
  Object.keys(groupedAppointments).forEach(status => {
    groupedAppointments[status].sort((a, b) => {
      const dateA = new Date(`${a.appointment_time.date}T${a.appointment_time.time}`);
      const dateB = new Date(`${b.appointment_time.date}T${b.appointment_time.time}`);
      return dateA - dateB;
    });
  });

  const validAppointmentsCount = appointmentsHistory.filter(
    appt => appt.status !== 'Cancelled'
  ).length;

  const fetchAppointmentHistory = async () => {
    try {
      setLoading(prev => ({ ...prev, history: true }));
      const data = await appointmentService.getAppointmentHistory();
      if (data != null){
        setAppointmentsHistory(data);
      }
    } catch (err) {
      setError('Failed to load appointment history. Please try again later.');
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, history: false }));
    }
  };

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
    fetchAppointmentHistory();
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      fetchAppointmentHistory();
    }
  }, [activeTab]);

  const toggleAppointmentDetails = (appointmentId) => {
    setExpandedAppointments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appointmentId)) {
        newSet.delete(appointmentId);
      } else {
        newSet.add(appointmentId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Cancelled': return 'error';
      case 'Scheduled': return 'primary';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Cancelled': return <CancelIcon color="error" />;
      case 'Scheduled': return <ScheduleSendIcon color="primary" />;
      case 'Completed': return <CheckCircleIcon color="success" />;
      default: return <EventAvailableIcon />;
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSpecialtyChange = async (event) => {
    const specialtyId = event.target.value;
    setSelectedSpecialty(specialtyId);
    setSelectedDoctor('');
    setSelectedSlot('');
    setAvailableSlots([]);
    setActiveStep(1);
  
    if (specialtyId) {
      try {
        setLoading(prev => ({ ...prev, doctors: true }));
        const doctorsData = await appointmentService.getDoctorsBySpecialty(specialtyId);
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
    setActiveStep(2);
    let appointmentTimes = [];
    
    if (doctorId) {
      try {
        const res = await appointmentService.getDoctorAppointmentTimes(doctorId);
        const appointment_times = res.appointment_times;
        appointmentTimes = appointment_times.map(timeStr => JSON.parse(timeStr));
      } catch (err) {
        setError('Failed to load scheduled appointment time slots. Please try again later.');
        console.error(err);
      }   
    }
    
    if (doctorId) {
      try {
        setLoading(prev => ({ ...prev, slots: true }));
        const availabilityData = await appointmentService.getDoctorAvailability(doctorId);

        let slots = processAvailabilityIntoTimeSlots(availabilityData);

        if (appointmentTimes.length > 0) {
          const bookedTimes = new Set(
            appointmentTimes.map(appt => new Date(`${appt.date}T${appt.time}`).toISOString())
          );
  
          slots = slots.filter(slot => !bookedTimes.has(slot.id));
        }

        setAvailableSlots(slots);
      } catch (err) {
        setError('Failed to load available time slots. Please try again later.');
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, slots: false }));
      }
    }
  };

  const processAvailabilityIntoTimeSlots = (availabilityData) => {
    const slots = [];
    const currentDate = new Date();
    const nextTwoWeeks = new Date(currentDate);
    nextTwoWeeks.setDate(nextTwoWeeks.getDate() + 14);
  
    let availability;
    try {
      availability = typeof availabilityData === 'string' 
        ? JSON.parse(availabilityData) 
        : availabilityData;
    } catch (e) {
      console.error("Error parsing availability data:", e);
      return [];
    }
  
    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", 
      "Thursday", "Friday", "Saturday"
    ];
  
    for (let d = 0; d < 14; d++) { // Extend to 14 days for better availability
      const date = new Date(currentDate);
      date.setDate(date.getDate() + d);
      const dayName = days[date.getDay()];
  
      if (!availability[dayName] || !availability[dayName].enabled) continue;
  
      availability[dayName].timeSlots.forEach(slot => {
        if (!slot.enabled) return;
  
        const [startHour, startMinute] = slot.startTime.split(':').map(Number);
        const [endHour, endMinute] = slot.endTime.split(':').map(Number);
  
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
  
        for (let time = startMinutes; time < endMinutes; time += 30) {
          const hour = Math.floor(time / 60);
          const minute = time % 60;
  
          const appointmentDate = new Date(date);
          appointmentDate.setHours(hour, minute, 0, 0);
  
          if (appointmentDate <= new Date()) continue;
  
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

  const handlePreviewFile = (file) => {
    const fileType = file.name.split('.').pop().toLowerCase();
    let mimeType = 'application/octet-stream';
    
    switch (fileType) {
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'txt':
        mimeType = 'text/plain';
        break;
      default:
        mimeType = 'application/octet-stream';
    }

    const blob = new Blob([file], { type: mimeType });
    const fileObj = new File([blob], file.name || 'file', { type: mimeType });
    setPreviewFile(fileObj);
    setPreviewOpen(true);
  };

  const handleDownloadFile = (fileName, fileData) => {
    const fileType = fileName.split('.').pop().toLowerCase();
    let mimeType = 'application/octet-stream';
    
    switch (fileType) {
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'txt':
        mimeType = 'text/plain';
        break;
      default:
        mimeType = 'application/octet-stream';
    }

    const blob = new Blob([fileData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewFile(null);
  };

  const renderFilePreview = () => {
    if (!previewFile) return null;

    const fileType = previewFile.type;
    const isImage = fileType.startsWith('image/');
    const isPDF = fileType === 'application/pdf';
    const isText = fileType === 'text/plain';

    return (
      <Dialog 
        open={previewOpen} 
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            <DescriptionIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            {previewFile.name}
          </Typography>
          <IconButton onClick={handleClosePreview} size="large">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          p: 0
        }}>
          {isImage && (
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.palette.grey[100]
            }}>
              <img 
                src={URL.createObjectURL(previewFile)} 
                alt={previewFile.name}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </Box>
          )}
          {isPDF && (
            <iframe
              src={URL.createObjectURL(previewFile)}
              style={{ 
                width: '100%', 
                height: '100%',
                border: 'none'
              }}
              title={previewFile.name}
            />
          )}
          {isText && (
            <Box sx={{ 
              width: '100%',
              height: '100%',
              p: 3,
              backgroundColor: theme.palette.background.paper,
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
            }}>
              {URL.createObjectURL(previewFile)}
            </Box>
          )}
          {!isImage && !isPDF && !isText && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              p: 4,
              textAlign: 'center'
            }}>
              <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Preview Not Available
              </Typography>
              <Typography color="text.secondary">
                This file type cannot be previewed. Please download to view.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          borderTop: `1px solid ${theme.palette.divider}`,
          py: 2,
          px: 3
        }}>
          <Button 
            onClick={handleClosePreview}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Close
          </Button>
          <Button 
            variant="contained"
            onClick={() => {
              const url = URL.createObjectURL(previewFile);
              const link = document.createElement('a');
              link.href = url;
              link.download = previewFile.name;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleBookAppointment = async () => {
    setError('');
    setSuccess('');
  
    if (!selectedSpecialty || !selectedDoctor || !selectedSlot) {
      setError('Please select specialty, doctor, and time slot.');
      return;
    }
  
    const selectedDate = new Date(selectedSlot);
    const localDate = new Date(selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000);
    
    const appointmentTime = {
      date: localDate.toISOString().split('T')[0],
      time: localDate.toISOString().split('T')[1].split('.')[0],
    };
  
    const formData = new FormData();
    formData.append('doctorId', selectedDoctor);
    formData.append('appointmentTime', JSON.stringify(appointmentTime));
    formData.append('problem', problemDescription);
  
    medicalFiles.forEach((file) => {
      formData.append(`files`, file);
    });
  
    try {
      setLoading(prev => ({ ...prev, booking: true }));
      await appointmentService.bookAppointment(formData);
      setSuccess(`Appointment booked successfully for ${formatDateTime(new Date(selectedSlot))}`);
      await fetchAppointmentHistory();
      resetForm();
      setActiveStep(0);
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

  const formatAppointmentDateTime = (appointment) => {
    if (!appointment.appointment_time) return 'Invalid date';
    
    try {
      const dateStr = appointment.appointment_time.date;
      const timeStr = appointment.appointment_time.time;
      const dateObj = new Date(`${dateStr}T${timeStr}`);
      
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

  const handleAppointmentStatusTabChange = (event, newValue) => {
    setAppointmentStatusTab(newValue);
  };

  const handleTimeSlotSelect = (slotId) => {
    setSelectedSlot(slotId);
    setActiveStep(3);
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveStep(prev => Math.min(3, prev + 1));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        gap: 2
      }}>
        <ProfessionalAvatar>
          <MedicalServicesIcon />
        </ProfessionalAvatar>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: 'primary.main',
              lineHeight: 1.2
            }}
          >
            Medical Appointments
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Schedule and manage your healthcare appointments
          </Typography>
        </Box>
      </Box>

      <StyledTabs value={activeTab} onChange={handleTabChange}>
        <StyledTab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScheduleIcon />
              Schedule Appointment
            </Box>
          }
        />
        <StyledTab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryIcon />
              <Box>
                Appointment History
                {validAppointmentsCount > 0 && (
                  <Badge 
                    badgeContent={validAppointmentsCount} 
                    color="primary"
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        position: 'relative',
                        transform: 'none',
                        ml: 1
                      } 
                    }}
                  />
                )}
              </Box>
            </Box>
          }
        />
      </StyledTabs>

      {activeTab === 0 && (
        <Paper elevation={3} sx={{ 
          p: 4, 
          borderRadius: 3, 
          mb: 4,
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              color: 'primary.main'
            }}
          >
            <ScheduleIcon fontSize="large" />
            New Appointment
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setError('')}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert 
              severity="success" 
              sx={{ mb: 3 }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setSuccess('')}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {success}
            </Alert>
          )}

          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Select Medical Specialty
              </Typography>
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
                    <MenuItem disabled>
                      <CircularProgress size={20} /> Loading...
                    </MenuItem>
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
                        <Box>
                          <Typography>{spec.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {spec.description || 'Medical specialty'}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!selectedSpecialty}
                  endIcon={<ExpandMoreIcon sx={{ transform: 'rotate(90deg)' }} />}
                >
                  Next: Choose Doctor
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Select Doctor
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }} disabled={!selectedSpecialty || loading.doctors}>
                <InputLabel>Select Doctor</InputLabel>
                <Select
                  value={selectedDoctor}
                  onChange={handleDoctorChange}
                  label="Select Doctor"
                >
                  <MenuItem value=""><em>Available Doctors</em></MenuItem>
                  {loading.doctors ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} /> Loading...
                    </MenuItem>
                  ) : doctors.length === 0 ? (
                    <MenuItem disabled>No doctors available for this specialty</MenuItem>
                  ) : (
                    doctors.map((doc) => (
                      <MenuItem key={doc.userId} value={doc.userId}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            {doc.firstName ? doc.firstName[0] : 'D'}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={500}>
                              Dr. {doc.firstName} {doc.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {doc.specialization} • {doc.yearsOfExperience} years experience • 
                              <Box component="span" sx={{ ml: 1, display: 'inline-flex', alignItems: 'center' }}>
                                <StarIcon fontSize="small" sx={{ color: 'warning.main', mr: 0.5 }} />
                                {doc.rating || '4.8'}
                              </Box>
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  startIcon={<ExpandMoreIcon sx={{ transform: 'rotate(-90deg)' }} />}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!selectedDoctor}
                  endIcon={<ExpandMoreIcon sx={{ transform: 'rotate(90deg)' }} />}
                >
                  Next: Pick Time Slot
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Available Time Slots
              </Typography>
              {loading.slots ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  minHeight: 200
                }}>
                  <CircularProgress />
                </Box>
              ) : availableSlots.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 4,
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 2
                }}>
                  <CalendarIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Available Slots
                  </Typography>
                  <Typography color="text.secondary">
                    This doctor currently has no available time slots. Please check back later.
                  </Typography>
                </Box>
              ) : (
                <>
                  <TimeSlotCalendar 
                    availableSlots={availableSlots}
                    selectedSlot={selectedSlot}
                    onSelect={handleTimeSlotSelect}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      startIcon={<ExpandMoreIcon sx={{ transform: 'rotate(-90deg)' }} />}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={!selectedSlot}
                      endIcon={<ExpandMoreIcon sx={{ transform: 'rotate(90deg)' }} />}
                    >
                      Next: Confirm Details
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Confirm Appointment Details
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardHeader 
                      title="Appointment Summary"
                      titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                    />
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <WorkIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                          Specialty
                        </Typography>
                        <Typography>
                          {specialties.find(s => s.id === selectedSpecialty)?.name || 'Not selected'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                          Doctor
                        </Typography>
                        <Typography>
                          {doctors.find(d => d.userId === selectedDoctor) ? 
                            `Dr. ${doctors.find(d => d.userId === selectedDoctor).firstName} ${doctors.find(d => d.userId === selectedDoctor).lastName}` : 
                            'Not selected'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <CalendarIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                          Date & Time
                        </Typography>
                        <Typography>
                          {selectedSlot ? formatDateTime(new Date(selectedSlot)) : 'Not selected'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardHeader 
                      title="Problem Description"
                      titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                    />
                    <CardContent>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Describe Your Problem"
                        value={problemDescription}
                        onChange={(e) => setProblemDescription(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      
                      <Box>
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
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
                              Uploaded Files:
                            </Typography>
                            <List disablePadding>
                              {medicalFiles.map((file, index) => (
                                <FilePreviewContainer key={index}>
                                  <DescriptionIcon sx={{ mr: 2, color: 'text.secondary' }} />
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" noWrap>
                                      {file.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {(file.size / 1024).toFixed(2)} KB
                                    </Typography>
                                  </Box>
                                  <Tooltip title="Preview">
                                    <IconButton
                                      size="small"
                                      onClick={() => handlePreviewFile(file)}
                                      sx={{ mr: 1 }}
                                    >
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Remove">
                                    <IconButton 
                                      size="small" 
                                      onClick={() => {
                                        setMedicalFiles(files => files.filter((_, i) => i !== index));
                                      }}
                                      color="error"
                                    >
                                      <CloseIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </FilePreviewContainer>
                              ))}
                            </List>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  startIcon={<ExpandMoreIcon sx={{ transform: 'rotate(-90deg)' }} />}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleBookAppointment}
                  disabled={!selectedSpecialty || !selectedDoctor || !selectedSlot || loading.booking}
                  sx={{ 
                    px: 4,
                    fontWeight: 'bold',
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      boxShadow: theme.shadows[4]
                    }
                  }}
                >
                  {loading.booking ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      Confirm Appointment
                      <CheckCircleIcon sx={{ ml: 1 }} />
                    </>
                  )}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper elevation={3} sx={{ 
          p: 3, 
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            gap: 2
          }}>
            <ProfessionalAvatar>
              <HistoryIcon />
            </ProfessionalAvatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Appointment History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage your past and upcoming appointments
              </Typography>
            </Box>
          </Box>

          {loading.history ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : appointmentsHistory.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              p: 4,
              backgroundColor: theme.palette.grey[100],
              borderRadius: 2
            }}>
              <EventAvailableIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Appointments Found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                You don't have any appointments yet. Schedule your first appointment now.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => setActiveTab(0)}
                startIcon={<ScheduleIcon />}
              >
                Schedule Appointment
              </Button>
            </Box>
          ) : (
            <Box>
              <Tabs
                value={appointmentStatusTab}
                onChange={handleAppointmentStatusTabChange}
                variant="fullWidth"
                sx={{
                  mb: 3,
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                    height: 3,
                  },
                }}
              >
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleSendIcon fontSize="small" />
                      Scheduled
                      <Chip 
                        label={groupedAppointments['Scheduled']?.length || 0} 
                        size="small" 
                        color="primary"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                  sx={{ 
                    textTransform: 'none',
                    '&.Mui-selected': {
                      color: 'primary.main',
                      fontWeight: 'bold',
                    }
                  }}
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon fontSize="small" />
                      Completed
                      <Chip 
                        label={groupedAppointments['Completed']?.length || 0} 
                        size="small" 
                        color="success"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                  sx={{ 
                    textTransform: 'none',
                    '&.Mui-selected': {
                      color: 'success.main',
                      fontWeight: 'bold',
                    }
                  }}
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CancelIcon fontSize="small" />
                      Cancelled
                      <Chip 
                        label={groupedAppointments['Cancelled']?.length || 0} 
                        size="small" 
                        color="error"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                  sx={{ 
                    textTransform: 'none',
                    '&.Mui-selected': {
                      color: 'error.main',
                      fontWeight: 'bold',
                    }
                  }}
                />
              </Tabs>

              <Box sx={{ mt: 2 }}>
                {appointmentStatusTab === 0 && (
                  <List disablePadding>
                    {groupedAppointments['Scheduled']?.map((appointment) => (
                      <Accordion 
                        key={appointment.id}
                        elevation={2}
                        expanded={expandedAppointments.has(appointment.id)}
                        onChange={() => toggleAppointmentDetails(appointment.id)}
                        sx={{ mb: 2, borderRadius: 2 }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            '& .MuiAccordionSummary-content': {
                              alignItems: 'center'
                            }
                          }}
                        >
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            flexGrow: 1
                          }}>
                            {getStatusIcon(appointment.status)}
                            <Box sx={{ ml: 2 }}>
                              <Typography variant="subtitle1" fontWeight={500}>
                                {formatAppointmentDateTime(appointment)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Dr. {appointment.doctor_name}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip 
                            label={appointment.status} 
                            color={getStatusColor(appointment.status)}
                            sx={{ 
                              fontWeight: 'bold', 
                              mr: 2,
                              backgroundColor: theme.palette[getStatusColor(appointment.status)].light,
                              color: theme.palette[getStatusColor(appointment.status)].dark
                            }}
                          />
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Problem:</strong> {appointment.problem_description || 'Not specified'}
                              </Typography>
                              {appointment.status === 'Cancelled' && appointment.cancellation_reason && (
                                <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                                  <strong>Cancellation Reason:</strong> {appointment.cancellation_reason}
                                </Typography>
                              )}
                            </Grid>
                            
                            {appointment.files && appointment.files.length > 0 && (
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
                                  Medical Reports:
                                </Typography>
                                <List disablePadding>
                                  {appointment.files.map((file, index) => (
                                    <FilePreviewContainer key={index}>
                                      <DescriptionIcon sx={{ mr: 2, color: 'text.secondary' }} />
                                      <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body2" noWrap>
                                          {file.file_name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {(file.file_data.length / 1024).toFixed(2)} KB
                                        </Typography>
                                      </Box>
                                      <Tooltip title="Preview">
                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            const fileType = file.file_type || 'application/octet-stream';
                                            const byteCharacters = atob(file.base64_data);
                                            const byteNumbers = new Array(byteCharacters.length);
                                            for (let i = 0; i < byteCharacters.length; i++) {
                                              byteNumbers[i] = byteCharacters.charCodeAt(i);
                                            }
                                            const byteArray = new Uint8Array(byteNumbers);
                                            const blob = new Blob([byteArray], { type: fileType });
                                            const fileObj = new File([blob], file.file_name, { type: fileType });
                                            handlePreviewFile(fileObj);
                                          }}
                                          sx={{ mr: 1 }}
                                        >
                                          <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Download">
                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            const byteCharacters = atob(file.base64_data);
                                            const byteNumbers = new Array(byteCharacters.length);
                                            for (let i = 0; i < byteCharacters.length; i++) {
                                              byteNumbers[i] = byteCharacters.charCodeAt(i);
                                            }
                                            const byteArray = new Uint8Array(byteNumbers);
                                            const blob = new Blob([byteArray], { type: file.file_type });
                                            const url = URL.createObjectURL(blob);
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = file.file_name;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            URL.revokeObjectURL(url);
                                          }}
                                        >
                                          <AttachFileIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </FilePreviewContainer>
                                  ))}
                                </List>
                              </Grid>
                            )}

                            {appointment.meet_link && appointment.status === 'Scheduled' && (
                              <Grid item xs={12}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  startIcon={<VideocamIcon />}
                                  href={appointment.meet_link}
                                  target="_blank"
                                  sx={{ mt: 1 }}
                                >
                                  Join Video Consultation
                                </Button>
                              </Grid>
                            )}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </List>
                )}

                {appointmentStatusTab === 1 && (
                  <List disablePadding>
                    {groupedAppointments['Completed']?.map((appointment) => (
                      <Accordion 
                        key={appointment.id}
                        elevation={2}
                        expanded={expandedAppointments.has(appointment.id)}
                        onChange={() => toggleAppointmentDetails(appointment.id)}
                        sx={{ mb: 2, borderRadius: 2 }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            '& .MuiAccordionSummary-content': {
                              alignItems: 'center'
                            }
                          }}
                        >
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            flexGrow: 1
                          }}>
                            {getStatusIcon(appointment.status)}
                            <Box sx={{ ml: 2 }}>
                              <Typography variant="subtitle1" fontWeight={500}>
                                {formatAppointmentDateTime(appointment)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Dr. {appointment.doctor_name}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip 
                            label={appointment.status} 
                            color={getStatusColor(appointment.status)}
                            sx={{ 
                              fontWeight: 'bold', 
                              mr: 2,
                              backgroundColor: theme.palette[getStatusColor(appointment.status)].light,
                              color: theme.palette[getStatusColor(appointment.status)].dark
                            }}
                          />
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Problem:</strong> {appointment.problem_description || 'Not specified'}
                              </Typography>
                              {appointment.status === 'Cancelled' && appointment.cancellation_reason && (
                                <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                                  <strong>Cancellation Reason:</strong> {appointment.cancellation_reason}
                                </Typography>
                              )}
                            </Grid>
                            
                            {appointment.files && appointment.files.length > 0 && (
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
                                  Medical Reports:
                                </Typography>
                                <List disablePadding>
                                  {appointment.files.map((file, index) => (
                                    <FilePreviewContainer key={index}>
                                      <DescriptionIcon sx={{ mr: 2, color: 'text.secondary' }} />
                                      <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body2" noWrap>
                                          {file.file_name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {(file.file_data.length / 1024).toFixed(2)} KB
                                        </Typography>
                                      </Box>
                                      <Tooltip title="Preview">
                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            const fileType = file.file_type || 'application/octet-stream';
                                            const byteCharacters = atob(file.base64_data);
                                            const byteNumbers = new Array(byteCharacters.length);
                                            for (let i = 0; i < byteCharacters.length; i++) {
                                              byteNumbers[i] = byteCharacters.charCodeAt(i);
                                            }
                                            const byteArray = new Uint8Array(byteNumbers);
                                            const blob = new Blob([byteArray], { type: fileType });
                                            const fileObj = new File([blob], file.file_name, { type: fileType });
                                            handlePreviewFile(fileObj);
                                          }}
                                          sx={{ mr: 1 }}
                                        >
                                          <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Download">
                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            const byteCharacters = atob(file.base64_data);
                                            const byteNumbers = new Array(byteCharacters.length);
                                            for (let i = 0; i < byteCharacters.length; i++) {
                                              byteNumbers[i] = byteCharacters.charCodeAt(i);
                                            }
                                            const byteArray = new Uint8Array(byteNumbers);
                                            const blob = new Blob([byteArray], { type: file.file_type });
                                            const url = URL.createObjectURL(blob);
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = file.file_name;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            URL.revokeObjectURL(url);
                                          }}
                                        >
                                          <AttachFileIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </FilePreviewContainer>
                                  ))}
                                </List>
                              </Grid>
                            )}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </List>
                )}

                {appointmentStatusTab === 2 && (
                  <List disablePadding>
                    {groupedAppointments['Cancelled']?.map((appointment) => (
                      <Accordion 
                        key={appointment.id}
                        elevation={2}
                        expanded={expandedAppointments.has(appointment.id)}
                        onChange={() => toggleAppointmentDetails(appointment.id)}
                        sx={{ mb: 2, borderRadius: 2 }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            '& .MuiAccordionSummary-content': {
                              alignItems: 'center'
                            }
                          }}
                        >
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            flexGrow: 1
                          }}>
                            {getStatusIcon(appointment.status)}
                            <Box sx={{ ml: 2 }}>
                              <Typography variant="subtitle1" fontWeight={500}>
                                {formatAppointmentDateTime(appointment)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Dr. {appointment.doctor_name}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip 
                            label={appointment.status} 
                            color={getStatusColor(appointment.status)}
                            sx={{ 
                              fontWeight: 'bold', 
                              mr: 2,
                              backgroundColor: theme.palette[getStatusColor(appointment.status)].light,
                              color: theme.palette[getStatusColor(appointment.status)].dark
                            }}
                          />
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Problem:</strong> {appointment.problem_description || 'Not specified'}
                              </Typography>
                              {appointment.status === 'Cancelled' && appointment.cancellation_reason && (
                                <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                                  <strong>Cancellation Reason:</strong> {appointment.cancellation_reason}
                                </Typography>
                              )}
                            </Grid>
                            
                            {appointment.files && appointment.files.length > 0 && (
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
                                  Medical Reports:
                                </Typography>
                                <List disablePadding>
                                  {appointment.files.map((file, index) => (
                                    <FilePreviewContainer key={index}>
                                      <DescriptionIcon sx={{ mr: 2, color: 'text.secondary' }} />
                                      <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body2" noWrap>
                                          {file.file_name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {(file.file_data.length / 1024).toFixed(2)} KB
                                        </Typography>
                                      </Box>
                                      <Tooltip title="Preview">
                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            const fileType = file.file_type || 'application/octet-stream';
                                            const byteCharacters = atob(file.base64_data);
                                            const byteNumbers = new Array(byteCharacters.length);
                                            for (let i = 0; i < byteCharacters.length; i++) {
                                              byteNumbers[i] = byteCharacters.charCodeAt(i);
                                            }
                                            const byteArray = new Uint8Array(byteNumbers);
                                            const blob = new Blob([byteArray], { type: fileType });
                                            const fileObj = new File([blob], file.file_name, { type: fileType });
                                            handlePreviewFile(fileObj);
                                          }}
                                          sx={{ mr: 1 }}
                                        >
                                          <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Download">
                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            const byteCharacters = atob(file.base64_data);
                                            const byteNumbers = new Array(byteCharacters.length);
                                            for (let i = 0; i < byteCharacters.length; i++) {
                                              byteNumbers[i] = byteCharacters.charCodeAt(i);
                                            }
                                            const byteArray = new Uint8Array(byteNumbers);
                                            const blob = new Blob([byteArray], { type: file.file_type });
                                            const url = URL.createObjectURL(blob);
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = file.file_name;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            URL.revokeObjectURL(url);
                                          }}
                                        >
                                          <AttachFileIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </FilePreviewContainer>
                                  ))}
                                </List>
                              </Grid>
                            )}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </List>
                )}
              </Box>
            </Box>
          )}
        </Paper>
      )}

      {renderFilePreview()}
    </Container>
  );
}