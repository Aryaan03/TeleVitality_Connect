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
  DialogActions
} from '@mui/material';
import { 
  Schedule as ScheduleIcon, 
  History as HistoryIcon,
  AttachFile as AttachFileIcon,
  ExpandMore as ExpandMoreIcon,
  MedicalServices as MedicalServicesIcon,
  Videocam as VideocamIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon
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

function TimeSlotCalendar({ availableSlots, selectedSlot, onSelect }) {
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
        <Box key={date} sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {groupedSlots[date].map(slot => (
              <Chip
                key={slot.id}
                label={new Date(slot.id).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                color={selectedSlot === slot.id ? 'primary' : 'default'}
                onClick={() => onSelect(slot.id)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

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
  const [expandedAppointments, setExpandedAppointments] = useState(new Set());
  const [previewFile, setPreviewFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState({
    specialties: false,
    doctors: false,
    slots: false,
    booking: false
  });

  const validAppointmentsCount = appointmentsHistory.filter(
    appt => appt.status !== 'Cancelled'
  ).length;

  const fetchAppointmentHistory = async () => {
    try {
      const data = await appointmentService.getAppointmentHistory();
      if (data != null){
        setAppointmentsHistory(data);
      }
    } catch (err) {
      setError('Failed to load appointment history. Please try again later.');
      console.error(err);
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
      case 'Scheduled': return 'success';
      case 'Completed': return 'primary';
      default: return 'default';
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
    let appointmentTimes = [];
    if(doctorId) {
      try{
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

        if(appointmentTimes.length>0){
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
  
    for (let d = 0; d < 7; d++) {
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
    // Create a proper File object with correct MIME type
    const fileType = file.name.split('.').pop().toLowerCase();
    let mimeType = 'application/octet-stream';
    
    // Set proper MIME type based on file extension
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

    // Create blob from file data
    const blob = new Blob([file], { type: mimeType });
    const fileObj = new File([blob], file.name || 'file', { type: mimeType });
    setPreviewFile(fileObj);
    setPreviewOpen(true);
  };

  const handleDownloadFile = (fileName, fileData) => {
    // Determine file type from extension
    const fileType = fileName.split('.').pop().toLowerCase();
    let mimeType = 'application/octet-stream';
    
    // Set proper MIME type based on file extension
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

    // Create blob from file data
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
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Preview: {previewFile.name}</Typography>
            <IconButton onClick={handleClosePreview}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {isImage && (
            <img 
              src={URL.createObjectURL(previewFile)} 
              alt={previewFile.name}
              style={{ maxWidth: '100%', maxHeight: '70vh' }}
            />
          )}
          {isPDF && (
            <iframe
              src={URL.createObjectURL(previewFile)}
              style={{ width: '100%', height: '70vh' }}
              title={previewFile.name}
            />
          )}
          {isText && (
            <Box sx={{ 
              maxHeight: '70vh', 
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              p: 2
            }}>
              {URL.createObjectURL(previewFile)}
            </Box>
          )}
          {!isImage && !isPDF && !isText && (
            <Typography color="text.secondary">
              Preview not available for this file type. Please download to view.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
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
    const utcDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
  
    const appointmentTime = {
      date: utcDate.toISOString().split('T')[0],
      time: utcDate.toISOString().split('T')[1].split('.')[0],
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 'bold', 
          mb: 4, 
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
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
            <Badge 
              badgeContent={validAppointmentsCount} 
              color="primary"
              sx={{ '& .MuiBadge-badge': { right: -8, top: 8 } }}
            >
              Appointment History
            </Badge>
          } 
          icon={<HistoryIcon />} 
          iconPosition="start"
        />
      </StyledTabs>

      {activeTab === 0 && (
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
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
                <MenuItem disabled>
                  <CircularProgress size={20} /> Loading...
                </MenuItem>
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

          <Paper variant="outlined" sx={{ mb: 3, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Available Time Slots
            </Typography>
            {loading.slots ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} />
              </Box>
            ) : availableSlots.length === 0 ? (
              <Typography>No available slots</Typography>
            ) : (
              <TimeSlotCalendar 
                availableSlots={availableSlots}
                selectedSlot={selectedSlot}
                onSelect={(slotId) => setSelectedSlot(slotId)}
              />
            )}
          </Paper>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Describe Your Problem"
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 3 }}>
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
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Uploaded Files:
                </Typography>
                <List>
                  {medicalFiles.map((file, index) => (
                    <ListItem 
                      key={index}
                      sx={{ 
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        mb: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <ListItemText 
                        primary={file.name}
                        secondary={`${(file.size / 1024).toFixed(2)} KB`}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handlePreviewFile(file)}
                        sx={{ mr: 1 }}
                      >
                        Preview
                      </Button>
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setMedicalFiles(files => files.filter((_, i) => i !== index));
                        }}
                        color="error"
                      >
                        <CloseIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>

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

          {appointmentsHistory == null || appointmentsHistory.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No appointment history found
            </Typography>
          ) : (
            <Box sx={{ 
              maxHeight: '60vh', 
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: (theme) => theme.palette.grey[100],
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: (theme) => theme.palette.grey[400],
                borderRadius: '4px',
              },
            }}>
              <List sx={{ width: '100%' }}>
                {appointmentsHistory && appointmentsHistory.map((appointment) => (
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
                        color={getStatusColor(appointment.status)}
                        sx={{ fontWeight: 'bold', mr: 2 }}
                      />
                      <IconButton onClick={() => toggleAppointmentDetails(appointment.id)}>
                        <ExpandMoreIcon sx={{
                          transform: expandedAppointments.has(appointment.id) ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.3s'
                        }} />
                      </IconButton>
                    </ListItem>
                    
                    {expandedAppointments.has(appointment.id) && (
                      <>
                        <Divider />
                        <Box sx={{ p: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Problem:</strong> {appointment.problem_description || 'Not specified'}
                          </Typography>
                          
                          {appointment.files && appointment.files.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
                                Medical Reports:
                              </Typography>
                              <List>
                                {appointment.files.map((file, index) => (
                                  <ListItem 
                                    key={index}
                                    sx={{ 
                                      bgcolor: 'background.paper',
                                      borderRadius: 1,
                                      mb: 1,
                                      border: '1px solid',
                                      borderColor: 'divider'
                                    }}
                                  >
                                    <ListItemText 
                                      primary={file.file_name}
                                      secondary={`${(file.file_data.length / 1024).toFixed(2)} KB`}
                                    />
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      startIcon={<VisibilityIcon />}
                                      onClick={() => {
                                        const fileType = file.file_name.split('.').pop().toLowerCase();
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

                                        const blob = new Blob([file.file_data], { type: mimeType });
                                        const fileObj = new File([blob], file.file_name, { type: mimeType });
                                        handlePreviewFile(fileObj);
                                      }}
                                      sx={{ mr: 1 }}
                                    >
                                      Preview
                                    </Button>
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      onClick={() => handleDownloadFile(file.file_name, file.file_data)}
                                    >
                                      Download
                                    </Button>
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          )}

                          {appointment.meet_link && (
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<VideocamIcon />}
                                href={appointment.meet_link}
                                target="_blank"
                                size="small"
                              >
                                Join Video Consultation
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </>
                    )}
                  </Paper>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      )}

      {renderFilePreview()}
    </Container>
  );
}