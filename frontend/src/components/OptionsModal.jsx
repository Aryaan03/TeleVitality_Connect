import React from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Modal, 
  IconButton 
} from '@mui/material';
import { Close, Person, MedicalServices } from '@mui/icons-material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
  outline: 'none',
};

const buttonStyle = {
  py: 3,
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '12px',
  width: '100%',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 3,
  }
};

export default function OptionsModal({ open, handleClose, action, openPatientDialogue, openDoctorDialogue }) {

  const handleDoctor = () => {
    handleClose();
    openDoctorDialogue();
  };

  const handlePatient = () => {
    handleClose();
    openPatientDialogue();
  };

  return (
    <Modal 
      open={open} 
      onClose={handleClose}
      BackdropProps={{ style: { backdropFilter: 'blur(4px)' }}}
    >
      <Box sx={modalStyle}>
        <IconButton 
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'text.secondary'
          }}
        >
          <Close />
        </IconButton>

        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            textAlign: 'center',
            mb: 3,
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          {action}
          <Box sx={{ 
            height: '4px',
            width: '60px',
            bgcolor: 'primary.main',
            mx: 'auto',
            mt: 1,
            borderRadius: '2px'
          }} />
        </Typography>

        <Button
          variant="contained"
          onClick={handlePatient}
          startIcon={<Person sx={{ fontSize: 28 }} />}
          sx={{
            ...buttonStyle,
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
          data-testid="patient-button"
        >
          Patient {action}
        </Button>

        <Typography 
          variant="body1" 
          sx={{
            textAlign: 'center',
            mt: 3,
            color: 'text.secondary',
            '& span': {
              color: 'primary.main',
              textDecoration: 'underline',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'none'
              }
            }
          }}
        >
          Are you a healthcare provider? <span onClick={handleDoctor} data-testid="doctor-button">{action} here</span>
        </Typography>
        
      </Box>
    </Modal>
  );
}