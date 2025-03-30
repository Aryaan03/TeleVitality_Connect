import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, CircularProgress, Alert, Divider, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Cancel as CancelIcon, Videocam as VideocamIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { authService } from '../services/api';
import { appointmentService } from '../services/appointmentService';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotesField, setShowNotesField] = useState({}); // State to toggle notes field for all appointments
  const [notes, setNotes] = useState({}); // State to manage notes for all appointments
  const [previewFile, setPreviewFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

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

                    {/* Add Files Section */}
                    {appointment.files && appointment.files.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
                          Patient&apos;s Medical Reports:
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
                                  handlePreviewFile(fileObj);
                                }}
                                sx={{ mr: 1 }}
                              >
                                Preview
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  // Convert base64 to blob for download
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

                    {/* Video Consultation Button */}
                    {appointment.meet_link && (
                      <Box sx={{ mt: 2 }}>
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
                </>
              )}
            </ListItem>
          ))}
        </List>
      )}

      {renderFilePreview()}
    </Box>
  );
}