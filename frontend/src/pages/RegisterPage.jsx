import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useState } from 'react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto' }}>
      <h1>Patient Registration</h1>
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
          confirmPassword: '' 
        }}
        validationSchema={Yup.object({
          username: Yup.string()
            .min(3, 'Username must be at least 3 characters')
            .required('Required'),
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Required')
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const registrationData = {
              username: values.username,
              email: values.email,
              password: values.password
            };
            await authService.register(registrationData);
            navigate('/login');
          } catch (err) {
            setError(err.message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            {/* Username Field */}
            <Field
              as={TextField}
              name="username"
              label="Username"
              fullWidth
              margin="normal"
              error={touched.username && !!errors.username}
              helperText={touched.username && errors.username}
            />

            {/* Email Field */}
            <Field
              as={TextField}
              name="email"
              label="Email"
              fullWidth
              margin="normal"
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
            />

            {/* Password Field */}
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

            {/* Confirm Password Field */}
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

            {/* Submit Button */}
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
  );
}