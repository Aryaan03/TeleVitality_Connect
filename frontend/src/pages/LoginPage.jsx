import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Patient Login
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={{ username: '', password: '' }} // Change from email to username
        validationSchema={Yup.object({
          username: Yup.string().required('Required'), // Change from email to username
          password: Yup.string().required('Required'),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await authService.login(values);
            localStorage.setItem('token', response.token);
            navigate('/dashboard');
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
              name="username" // Change from email to username
              label="Username" // Change from email to username
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
              sx={{color:"#1976d2", fontSize:"14px", fontWeight:'bold', marginTop:'4px', cursor: 'pointer'}}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </Typography>
            <Typography sx={{ mt: 2, textAlign: 'center' }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#1976d2',
                  fontWeight: 'bold'
                }}
              >
                Register
              </Link>
            </Typography>
          </Form>
        )}
      </Formik>
    </Box>
  );
}