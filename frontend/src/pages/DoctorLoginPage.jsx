import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Modal, Button, TextField, Box, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function DoctorLoginPage({ open, handleClose }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  return (
    <Modal open={open} onClose={handleClose}>
      <Box 
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Doctor Login
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={Yup.object({
            username: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await authService.doclogin(values);
              localStorage.setItem('token', response.token);
              handleClose(); // Close modal
              navigate('/doctor-profile'); // Redirect to profile page
              //window.location.reload(); // Refresh the page or navigate to another route
            } catch (err) {
              setError(err.message || 'Login failed. Please try again.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                name="username"
                label="Username"
                fullWidth
                margin="normal"
                error={touched.username && !!errors.username}
                helperText={touched.username && errors.username}
              />
              
              <Field
                as={TextField}
                name="password"
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />

              <Button 
                type="submit" 
                variant="contained" 
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 3 }}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>

              <Typography 
                sx={{ color:"#1976d2", fontSize:"14px", fontWeight:'bold', marginTop:'4px', cursor: 'pointer' }}
                onClick={() => alert('Forgot Password clicked!')}
              >
                Forgot Password?
              </Typography>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}
