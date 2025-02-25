import React from 'react';
import { Box, Button, Typography, Modal, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function OptionsModal({ open, handleClose, action, openPatientDialogue, openDoctorDialogue }) {
  const navigate = useNavigate();

  const handleDoctor = () => {
    handleClose();
    openDoctorDialogue(); // Open Doctor Registration Modal
    // navigate('/doctor-register'); // Navigate to Doctor Registration Page
  };

  const handlePatient = () => {
    handleClose();
    openPatientDialogue(); // Open Patient Registration Modal
    // navigate('/register'); // Navigate to Patient Registration Page
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mb: 3 }}>
           {action} As
        </Typography>
        <Stack spacing={2}>
          <Button variant="contained" onClick={handleDoctor}>
            {action} as Doctor
          </Button>
          <Button variant="contained" onClick={handlePatient}>
            {action} as Patient
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
