import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Button, TextField, Box, Typography, 
  MenuItem, FormControlLabel, Checkbox, Alert 
} from '@mui/material';
import { authService } from '../services/api';
import { useState } from 'react';

export default function ProfilePage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock initial values - replace with actual data from your auth system
  const initialValues = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    phoneNumber: '+1234567890',
    address: '123 Main St, City',
    problemDescription: 'Regular checkup required',
    emergencyAppointment: 'no',
    previousPatientId: '',
    preferredCommunication: 'email',
    preferredDoctor: 'drSmith',
    insuranceProvider: 'HealthCare Plus',
    insurancePolicyNumber: 'HC-123456',
    consentTelemedicine: true
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    dateOfBirth: Yup.date().required('Required'),
    gender: Yup.string().required('Required'),
    phoneNumber: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    problemDescription: Yup.string().required('Required'),
    preferredCommunication: Yup.string().required('Required'),
    insuranceProvider: Yup.string().required('Required'),
    insurancePolicyNumber: Yup.string().required('Required'),
  });

  const handleSubmit = async (values) => {
    try {
      await authService.updateProfile(values);
      setSuccess('Profile updated successfully!');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Patient Profile
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Personal Information
                </Typography>
                
                <Field
                  as={TextField}
                  name="firstName"
                  label="First Name"
                  fullWidth
                  margin="normal"
                  error={touched.firstName && !!errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                />

                <Field
                  as={TextField}
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  margin="normal"
                  error={touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                />

                <Field
                  as={TextField}
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  error={touched.dateOfBirth && !!errors.dateOfBirth}
                  helperText={touched.dateOfBirth && errors.dateOfBirth}
                />

                <Field
                  as={TextField}
                  name="gender"
                  label="Gender"
                  select
                  fullWidth
                  margin="normal"
                  error={touched.gender && !!errors.gender}
                  helperText={touched.gender && errors.gender}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Field>
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Contact Details
                </Typography>

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
                  name="phoneNumber"
                  label="Phone Number"
                  fullWidth
                  margin="normal"
                  error={touched.phoneNumber && !!errors.phoneNumber}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                />

                <Field
                  as={TextField}
                  name="address"
                  label="Address"
                  fullWidth
                  margin="normal"
                  error={touched.address && !!errors.address}
                  helperText={touched.address && errors.address}
                />
              </Grid>

              {/* Medical Information */}
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  Medical Information
                </Typography>

                <Field
                  as={TextField}
                  name="problemDescription"
                  label="Medical Condition Description"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  error={touched.problemDescription && !!errors.problemDescription}
                  helperText={touched.problemDescription && errors.problemDescription}
                />

                <Field
                  as={TextField}
                  name="preferredDoctor"
                  label="Preferred Doctor"
                  select
                  fullWidth
                  margin="normal"
                  error={touched.preferredDoctor && !!errors.preferredDoctor}
                  helperText={touched.preferredDoctor && errors.preferredDoctor}
                >
                  <MenuItem value="drSmith">Dr. Smith (General Physician)</MenuItem>
                  <MenuItem value="drJones">Dr. Jones (Cardiologist)</MenuItem>
                  <MenuItem value="drLee">Dr. Lee (Dermatologist)</MenuItem>
                </Field>
              </Grid>

              {/* Insurance Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Insurance Details
                </Typography>

                <Field
                  as={TextField}
                  name="insuranceProvider"
                  label="Insurance Provider"
                  fullWidth
                  margin="normal"
                  error={touched.insuranceProvider && !!errors.insuranceProvider}
                  helperText={touched.insuranceProvider && errors.insuranceProvider}
                />

                <Field
                  as={TextField}
                  name="insurancePolicyNumber"
                  label="Policy Number"
                  fullWidth
                  margin="normal"
                  error={touched.insurancePolicyNumber && !!errors.insurancePolicyNumber}
                  helperText={touched.insurancePolicyNumber && errors.insurancePolicyNumber}
                />
              </Grid>

              {/* Preferences */}
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Preferences
                </Typography>

                <Field
                  as={TextField}
                  name="preferredCommunication"
                  label="Preferred Communication"
                  select
                  fullWidth
                  margin="normal"
                  error={touched.preferredCommunication && !!errors.preferredCommunication}
                  helperText={touched.preferredCommunication && errors.preferredCommunication}
                >
                  <MenuItem value="phone">Phone</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="videoCall">Video Call</MenuItem>
                </Field>

                <FormControlLabel
                  control={
                    <Field
                      as={Checkbox}
                      name="consentTelemedicine"
                      color="primary"
                    />
                  }
                  label="I consent to telemedicine services"
                />
              </Grid>
            </Grid>

            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              sx={{ mt: 3 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
}