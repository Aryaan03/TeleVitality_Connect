import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  CircularProgress, 
  Alert, 
  Divider, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Paper,
  Chip,
  Avatar,
  Collapse,
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Cancel as CancelIcon, 
  Videocam as VideocamIcon, 
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  AttachFile as AttachFileIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { appointmentService } from '../services/appointmentService';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotesField, setShowNotesField] = useState({});
  const [notes, setNotes] = useState({});
  const [previewFile, setPreviewFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [expandedAppointments, setExpandedAppointments] = useState(new Set());
  const [appointmentStatusTab, setAppointmentStatusTab] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');

  // Group appointments by status
  const groupedAppointments = appointments.reduce((acc, appointment) => {
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
        setNotes(initialNotes);
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
      setError('Failed to save notes. Please try again.');
    }
  };

  const handleCancelClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    try {
      await appointmentService.cancelAppointment(selectedAppointmentId, cancellationReason);
      setAppointments(prevAppointments => 
        prevAppointments.map(appt => 
          appt.id === selectedAppointmentId 
            ? { ...appt, status: 'Cancelled', cancellation_reason: cancellationReason } 
            : appt
        )
      );
      setCancelDialogOpen(false);
      setCancellationReason('');
      setSelectedAppointmentId(null);
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      setError('Failed to cancel appointment. Please try again.');
    }
  };

  const handleCancelClose = () => {
    setCancelDialogOpen(false);
    setCancellationReason('');
    setSelectedAppointmentId(null);
  };

  const formatDateTime = (appointmentTime) => {
    if (!appointmentTime) return 'N/A';

    try {
      const date = appointmentTime.date || 'N/A';
      const time = appointmentTime.time || 'N/A';
      const dateObj = new Date(`${date}T${time}`);
      return dateObj.toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Cancelled': return 'error';
      case 'Scheduled': return 'success';
      case 'Completed': return 'primary';
      default: return 'default';
    }
  };

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

  const handlePreviewFile = (file) => {
    const fileType = file.file_type || 'application/octet-stream';
    // Convert base64 to blob
    const byteCharacters = atob(file.base64_data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });
    const fileObj = new File([blob], file.file_name, { type: fileType });
    setPreviewFile(fileObj);
    setPreviewOpen(true);
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
              <CancelIcon />
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

  const handleAppointmentStatusTabChange = (event, newValue) => {
    setAppointmentStatusTab(newValue);
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', p: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ 
        fontWeight: 'bold',
        color: 'primary.main',
        mb: 4
      }}>
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
        <Box>
          <Tabs
            value={appointmentStatusTab}
            onChange={handleAppointmentStatusTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
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
                  Scheduled
                  <Chip 
                    label={groupedAppointments['Scheduled']?.length || 0} 
                    size="small" 
                    color="success"
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
              sx={{ 
                color: 'success.main',
                '&.Mui-selected': {
                  color: 'success.main',
                  fontWeight: 'bold',
                }
              }}
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Completed
                  <Chip 
                    label={groupedAppointments['Completed']?.length || 0} 
                    size="small" 
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
              sx={{ 
                color: 'primary.main',
                '&.Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 'bold',
                }
              }}
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                color: 'error.main',
                '&.Mui-selected': {
                  color: 'error.main',
                  fontWeight: 'bold',
                }
              }}
            />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {appointmentStatusTab === 0 && (
              <List>
                {groupedAppointments['Scheduled']?.map((appointment) => (
                  <Paper key={appointment.id} elevation={2} sx={{ mb: 2, borderRadius: 2 }}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {appointment.patient_name ? appointment.patient_name[0] : 'P'}
                            </Avatar>
                            <Box>
                              <Typography variant="h6">
                                {appointment.patient_name || 'N/A'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatDateTime(appointment.appointment_time)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Problem:</strong> {appointment.problem_description || 'Not specified'}
                            </Typography>
                            {appointment.status === 'Cancelled' && appointment.cancellation_reason && (
                              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                <strong>Cancellation Reason:</strong> {appointment.cancellation_reason}
                              </Typography>
                            )}
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                              <Chip 
                                label={appointment.status || 'Scheduled'} 
                                color={getStatusColor(appointment.status)}
                                size="small"
                              />
                              {appointment.meet_link && appointment.status === 'Scheduled' && (
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
                              )}
                            </Box>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={() => toggleAppointmentDetails(appointment.id)}>
                          <ExpandMoreIcon sx={{
                            transform: expandedAppointments.has(appointment.id) ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.3s'
                          }} />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleCancelClick(appointment.id)}
                          disabled={appointment.status === 'Cancelled' || appointment.status === 'Completed'}
                          title="Cancel appointment"
                        >
                          <CancelIcon color={appointment.status === 'Cancelled' || appointment.status === 'Completed' ? 'disabled' : 'error'} />
                        </IconButton>
                      </Box>
                    </ListItem>

                    <Collapse in={expandedAppointments.has(appointment.id)}>
                      <Divider />
                      <Box sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            {appointment.files && appointment.files.length > 0 && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <AttachFileIcon /> Patient's Medical Reports
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
                                        secondary={`${(file.base64_data.length * 0.75 / 1024).toFixed(2)} KB`}
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
                                      <Button
                                        variant="outlined"
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
                                        Download
                                      </Button>
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                Notes:
                              </Typography>
                              {isAppointmentEnded(appointment.appointment_time) && (
                                <IconButton 
                                  size="small" 
                                  onClick={() => setShowNotesField(prev => ({ ...prev, [appointment.id]: true }))}
                                >
                                  <EditIcon />
                                </IconButton>
                              )}
                            </Box>
                            {showNotesField[appointment.id] ? (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={3}
                                  value={notes[appointment.id] || ''}
                                  onChange={(e) => setNotes(prev => ({ ...prev, [appointment.id]: e.target.value }))}
                                  size="small"
                                />
                                <Button
                                  variant="contained"
                                  startIcon={<SaveIcon />}
                                  onClick={() => handleSaveNotes(appointment.id)}
                                  sx={{ alignSelf: 'flex-start' }}
                                >
                                  Save
                                </Button>
                              </Box>
                            ) : (
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                {appointment.notes || 'No notes available'}
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </Paper>
                ))}
              </List>
            )}

            {appointmentStatusTab === 1 && (
              <List>
                {groupedAppointments['Completed']?.map((appointment) => (
                  <Paper key={appointment.id} elevation={2} sx={{ mb: 2, borderRadius: 2 }}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {appointment.patient_name ? appointment.patient_name[0] : 'P'}
                            </Avatar>
                            <Box>
                              <Typography variant="h6">
                                {appointment.patient_name || 'N/A'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatDateTime(appointment.appointment_time)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Problem:</strong> {appointment.problem_description || 'Not specified'}
                            </Typography>
                            {appointment.status === 'Cancelled' && appointment.cancellation_reason && (
                              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                <strong>Cancellation Reason:</strong> {appointment.cancellation_reason}
                              </Typography>
                            )}
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                              <Chip 
                                label={appointment.status || 'Scheduled'} 
                                color={getStatusColor(appointment.status)}
                                size="small"
                              />
                              {appointment.meet_link && appointment.status === 'Scheduled' && (
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
                              )}
                            </Box>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={() => toggleAppointmentDetails(appointment.id)}>
                          <ExpandMoreIcon sx={{
                            transform: expandedAppointments.has(appointment.id) ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.3s'
                          }} />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleCancelClick(appointment.id)}
                          disabled={appointment.status === 'Cancelled' || appointment.status === 'Completed'}
                          title="Cancel appointment"
                        >
                          <CancelIcon color={appointment.status === 'Cancelled' || appointment.status === 'Completed' ? 'disabled' : 'error'} />
                        </IconButton>
                      </Box>
                    </ListItem>

                    <Collapse in={expandedAppointments.has(appointment.id)}>
                      <Divider />
                      <Box sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            {appointment.files && appointment.files.length > 0 && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <AttachFileIcon /> Patient's Medical Reports
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
                                        secondary={`${(file.base64_data.length * 0.75 / 1024).toFixed(2)} KB`}
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
                                      <Button
                                        variant="outlined"
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
                                        Download
                                      </Button>
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                Notes:
                              </Typography>
                              {isAppointmentEnded(appointment.appointment_time) && (
                                <IconButton 
                                  size="small" 
                                  onClick={() => setShowNotesField(prev => ({ ...prev, [appointment.id]: true }))}
                                >
                                  <EditIcon />
                                </IconButton>
                              )}
                            </Box>
                            {showNotesField[appointment.id] ? (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={3}
                                  value={notes[appointment.id] || ''}
                                  onChange={(e) => setNotes(prev => ({ ...prev, [appointment.id]: e.target.value }))}
                                  size="small"
                                />
                                <Button
                                  variant="contained"
                                  startIcon={<SaveIcon />}
                                  onClick={() => handleSaveNotes(appointment.id)}
                                  sx={{ alignSelf: 'flex-start' }}
                                >
                                  Save
                                </Button>
                              </Box>
                            ) : (
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                {appointment.notes || 'No notes available'}
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </Paper>
                ))}
              </List>
            )}

            {appointmentStatusTab === 2 && (
              <List>
                {groupedAppointments['Cancelled']?.map((appointment) => (
                  <Paper key={appointment.id} elevation={2} sx={{ mb: 2, borderRadius: 2 }}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {appointment.patient_name ? appointment.patient_name[0] : 'P'}
                            </Avatar>
                            <Box>
                              <Typography variant="h6">
                                {appointment.patient_name || 'N/A'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatDateTime(appointment.appointment_time)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Problem:</strong> {appointment.problem_description || 'Not specified'}
                            </Typography>
                            {appointment.status === 'Cancelled' && appointment.cancellation_reason && (
                              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                <strong>Cancellation Reason:</strong> {appointment.cancellation_reason}
                              </Typography>
                            )}
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                              <Chip 
                                label={appointment.status || 'Scheduled'} 
                                color={getStatusColor(appointment.status)}
                                size="small"
                              />
                              {appointment.meet_link && appointment.status === 'Scheduled' && (
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
                              )}
                            </Box>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={() => toggleAppointmentDetails(appointment.id)}>
                          <ExpandMoreIcon sx={{
                            transform: expandedAppointments.has(appointment.id) ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.3s'
                          }} />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleCancelClick(appointment.id)}
                          disabled={appointment.status === 'Cancelled' || appointment.status === 'Completed'}
                          title="Cancel appointment"
                        >
                          <CancelIcon color={appointment.status === 'Cancelled' || appointment.status === 'Completed' ? 'disabled' : 'error'} />
                        </IconButton>
                      </Box>
                    </ListItem>

                    <Collapse in={expandedAppointments.has(appointment.id)}>
                      <Divider />
                      <Box sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            {appointment.files && appointment.files.length > 0 && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <AttachFileIcon /> Patient's Medical Reports
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
                                        secondary={`${(file.base64_data.length * 0.75 / 1024).toFixed(2)} KB`}
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
                                      <Button
                                        variant="outlined"
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
                                        Download
                                      </Button>
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                Notes:
                              </Typography>
                              {isAppointmentEnded(appointment.appointment_time) && (
                                <IconButton 
                                  size="small" 
                                  onClick={() => setShowNotesField(prev => ({ ...prev, [appointment.id]: true }))}
                                >
                                  <EditIcon />
                                </IconButton>
                              )}
                            </Box>
                            {showNotesField[appointment.id] ? (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={3}
                                  value={notes[appointment.id] || ''}
                                  onChange={(e) => setNotes(prev => ({ ...prev, [appointment.id]: e.target.value }))}
                                  size="small"
                                />
                                <Button
                                  variant="contained"
                                  startIcon={<SaveIcon />}
                                  onClick={() => handleSaveNotes(appointment.id)}
                                  sx={{ alignSelf: 'flex-start' }}
                                >
                                  Save
                                </Button>
                              </Box>
                            ) : (
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                {appointment.notes || 'No notes available'}
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </Paper>
                ))}
              </List>
            )}
          </Box>
        </Box>
      )}

      {renderFilePreview()}

      <Dialog open={cancelDialogOpen} onClose={handleCancelClose}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Cancellation"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose}>Cancel</Button>
          <Button 
            onClick={handleCancelConfirm} 
            color="error"
            disabled={!cancellationReason.trim()}
          >
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}