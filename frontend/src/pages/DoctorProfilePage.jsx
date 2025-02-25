import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  TextField,
  Box,
  Typography,
  MenuItem,
  Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

export default function DoctorProfilePage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Dummy data for testing
        const profileData = {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1985-07-15',
          gender: 'Male',
          phoneNumber: '123-456-7890',
          medicalLicenseNumber: 'LIC123456',
          issuingMedicalBoard: 'Medical Board of XYZ',
          licenseExpiryDate: '2030-12-31',
          specialization: 'Cardiology',
          yearsOfExperience: 15,
          hospitalName: 'City Hospital',
          workAddress: '123 Medical Street, New York, NY',
          consultationType: 'In-person',
        };

        setInitialValues(profileData);
        setError('');
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Unable to load profile. Please try again later.');
      }
    };

    fetchProfile();
  }, []);

  if (initialValues === null) return <Typography>Loading...</Typography>;

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    dateOfBirth: Yup.date().required('Required'),
    gender: Yup.string().required('Required'),
    phoneNumber: Yup.string().required('Required'),
    medicalLicenseNumber: Yup.string().required('Required'),
    issuingMedicalBoard: Yup.string().required('Required'),
    licenseExpiryDate: Yup.date().required('Required'),
    specialization: Yup.string().required('Required'),
    yearsOfExperience: Yup.number()
      .min(0, 'Must be a positive number')
      .required('Required'),
    hospitalName: Yup.string().required('Required'),
    workAddress: Yup.string().required('Required'),
    consultationType: Yup.string().required('Required'),
  });

  const handleSubmit = async (values) => {
    console.log('Submitted values:', values);
    setSuccess('Profile updated successfully!');
    setError('');
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Doctor Profile
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="firstName"
                  label="First Name"
                  fullWidth
                  margin="normal"
                  error={touched.firstName && !!errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  margin="normal"
                  error={touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                  error={touched.dateOfBirth && !!errors.dateOfBirth}
                  helperText={touched.dateOfBirth && errors.dateOfBirth}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Field>
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="phoneNumber"
                  label="Phone Number"
                  fullWidth
                  margin="normal"
                  error={touched.phoneNumber && !!errors.phoneNumber}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="medicalLicenseNumber"
                  label="Medical License Number"
                  fullWidth
                  margin="normal"
                  error={touched.medicalLicenseNumber && !!errors.medicalLicenseNumber}
                  helperText={touched.medicalLicenseNumber && errors.medicalLicenseNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="issuingMedicalBoard"
                  label="Issuing Medical Board"
                  fullWidth
                  margin="normal"
                  error={touched.issuingMedicalBoard && !!errors.issuingMedicalBoard}
                  helperText={touched.issuingMedicalBoard && errors.issuingMedicalBoard}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="licenseExpiryDate"
                  label="License Expiry Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                  error={touched.licenseExpiryDate && !!errors.licenseExpiryDate}
                  helperText={touched.licenseExpiryDate && errors.licenseExpiryDate}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="specialization"
                  label="Specialization"
                  fullWidth
                  margin="normal"
                  error={touched.specialization && !!errors.specialization}
                  helperText={touched.specialization && errors.specialization}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="yearsOfExperience"
                  label="Years of Experience"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={touched.yearsOfExperience && !!errors.yearsOfExperience}
                  helperText={touched.yearsOfExperience && errors.yearsOfExperience}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="hospitalName"
                  label="Hospital Name"
                  fullWidth
                  margin="normal"
                  error={touched.hospitalName && !!errors.hospitalName}
                  helperText={touched.hospitalName && errors.hospitalName}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name="workAddress"
                  label="Work Address"
                  fullWidth
                  margin="normal"
                  multiline
                  error={touched.workAddress && !!errors.workAddress}
                  helperText={touched.workAddress && errors.workAddress}
                />
              </Grid>
            </Grid>

            <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }}>
              Save Profile
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
