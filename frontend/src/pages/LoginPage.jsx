import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { mockLogin } from '../utils/api';

export default function LoginPage() {
  return (
    <Box sx={{ maxWidth: 400, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
      <h1>Patient Login</h1></Typography>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().required('Required'),
        })}
        onSubmit={async (values) => {
          const response = await mockLogin(values);
          localStorage.setItem('token', response.token);
          window.location = '/dashboard';
        }}
      >
        {({ errors, touched }) => (
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
              sx={{ mt: 3 }}
            >
              Login
            </Button>

            {/* Add registration redirect */}
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
