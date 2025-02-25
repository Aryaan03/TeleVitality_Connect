import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Modal, Button, TextField, Box, Typography, FormControlLabel, Checkbox, Alert } from '@mui/material';
import { useState } from 'react';
import { authService } from '../services/api';

export default function DoctorRegisterPage({ open, handleClose, openLogin }) {
  const [error, setError] = useState('');

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
          Doctor Registration
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{ 
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            consentTelemedicine: false
          }}
          validationSchema={Yup.object({
            username: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email').required('Required'),
            password: Yup.string()
              .min(8, 'Password must be at least 8 characters')
              .required('Required'),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref('password')], 'Passwords must match')
              .required('Required'),
            consentTelemedicine: Yup.boolean()
              .oneOf([true], 'You must agree to the terms and conditions')
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await authService.docregister({
                username: values.username,
                email: values.email,
                password: values.password
              });
              handleClose(); // Close the modal after successful registration
              openLogin();
            } catch (err) {
              setError(err.message || 'Registration failed. Please try again.');
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
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
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

              <Field
                as={TextField}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                error={touched.confirmPassword && !!errors.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />

              <FormControlLabel
                control={
                  <Field
                    as={Checkbox}
                    name="consentTelemedicine"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the terms and conditions of telemedicine services
                  </Typography>
                }
              />
              {touched.consentTelemedicine && errors.consentTelemedicine && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {errors.consentTelemedicine}
                </Typography>
              )}

              <Button 
                type="submit" 
                variant="contained" 
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 3 }}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}
