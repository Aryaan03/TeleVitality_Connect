import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useState } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto' }}>
      <h1>Patient Login</h1>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          password: Yup.string()
            .required('Required'),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await authService.login(values);
            // If you implement JWT token in the future:
            // localStorage.setItem('token', response.token);
            navigate('/dashboard');
          } catch (err) {
            setError(err.message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
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

            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              disabled={isSubmitting}
              sx={{ mt: 3 }}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
}