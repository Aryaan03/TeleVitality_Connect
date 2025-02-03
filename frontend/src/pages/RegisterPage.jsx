import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Box } from '@mui/material';

export default function RegisterPage() {
  return (
    <Box sx={{ maxWidth: 400, margin: 'auto' }}>
      <h1>Patient Registration</h1>
      <Formik
        initialValues={{ 
          email: '',
          password: '',
          confirmPassword: '' 
        }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().required('Required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Required')
        })}
        onSubmit={(values) => console.log(values)}
      >
        {({ errors, touched }) => (
          <Form>
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
              sx={{ mt: 3 }}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
