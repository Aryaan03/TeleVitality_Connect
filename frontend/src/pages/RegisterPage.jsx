import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Box, Typography, FormControlLabel, Checkbox, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Patient Registration
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
            await authService.register({
              username: values.username,
              email: values.email,
              password: values.password
            });
            navigate('/login');
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

            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#1976d2',
                  fontWeight: 'bold'
                }}
              >
                Login
              </Link>
            </Typography>
          </Form>
        )}
      </Formik>
    </Box>
  );
}