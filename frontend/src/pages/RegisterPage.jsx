import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Box, Typography, FormControlLabel, Checkbox, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Patient Registration
      </Typography>

      <Formik
        initialValues={{ 
          UserName: '',
          email: '',
          password: '',
          confirmPassword: '',
          consentTelemedicine: false
        }}
        validationSchema={Yup.object({
          UserName: Yup.string().required('Required'),
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().required('Required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Required'),
          consentTelemedicine: Yup.boolean()
            .oneOf([true], 'You must agree to the terms and conditions')
        })}
        onSubmit={(values) => {
          console.log(values); // Replace with actual registration logic
          navigate('/login'); // Redirect to login after registration
        }}
      >
        {({ errors, touched }) => (
          <Form>
            {/* User Name Field */}
            <Field
              as={TextField}
              name="UserName"
              label="User Name"
              fullWidth
              margin="normal"
              error={touched.UserName && !!errors.UserName}
              helperText={touched.UserName && errors.UserName}
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

            {/* Telemedicine Consent Checkbox */}
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
                  I agree to the terms and conditions of telemedicine services, including privacy and data security compliance.
                </Typography>
              }
            />
            {touched.consentTelemedicine && errors.consentTelemedicine && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {errors.consentTelemedicine}
              </Typography>
            )}

            {/* Register Button */}
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              sx={{ mt: 3 }}
            >
              Register
            </Button>

            {/* Redirect to Login */}
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Already have an account?{' '}
              <Link 
                href="/login" 
                sx={{ fontWeight: 'bold', textDecoration: 'none' }}
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
