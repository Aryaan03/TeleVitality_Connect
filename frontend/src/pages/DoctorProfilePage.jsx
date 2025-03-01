import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  TextField,
  Box,
  Typography,
  MenuItem,
  Alert,
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import DoctorAvailabilityCalendar from '../components/DoctorAvailabilityCalendar';
import TimeSlotPicker from '../components/TimeSlotPicker';
import { authService } from '../services/api'; // Import your API service

export default function DoctorProfilePage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  // Enhanced availability state
  const [availability, setAvailability] = useState({
    Monday: {
      enabled: false,
      timeSlots: [{ startTime: '09:00', endTime: '17:00', enabled: true }],
    },
    Tuesday: {
      enabled: false,
      timeSlots: [{ startTime: '09:00', endTime: '17:00', enabled: true }],
    },
    Wednesday: {
      enabled: false,
      timeSlots: [{ startTime: '09:00', endTime: '17:00', enabled: true }],
    },
    Thursday: {
      enabled: false,
      timeSlots: [{ startTime: '09:00', endTime: '17:00', enabled: true }],
    },
    Friday: {
      enabled: false,
      timeSlots: [{ startTime: '09:00', endTime: '17:00', enabled: true }],
    },
    Saturday: {
      enabled: false,
      timeSlots: [{ startTime: '09:00', endTime: '17:00', enabled: true }],
    },
    Sunday: {
      enabled: false,
      timeSlots: [{ startTime: '09:00', endTime: '17:00', enabled: true }],
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile(); // Fetch profile data from backend
        setInitialValues(profileData);

        // Parse availability from backend (if available)
        if (profileData.availability) {
          setAvailability(JSON.parse(profileData.availability));
        }

        setError('');
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Unable to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

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
    try {
      // Combine form values with availability data
      const formData = {
        ...values,
        availability: JSON.stringify(availability), // Convert availability to JSON string
      };

      // Send data to backend
      await authService.updateDoctorProfile(formData);

      setSuccess('Profile updated successfully!');
      setError('');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      setSuccess('');
    }
  };

  // Handler for updating availability
  const handleAvailabilityUpdate = (day, dayAvailability) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: dayAvailability,
    }));
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
        {({ errors, touched, isSubmitting }) => (
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
              {/* Specialization Dropdown */}
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="specialization"
                  label="Specialization"
                  select
                  fullWidth
                  margin="normal"
                  error={touched.specialization && !!errors.specialization}
                  helperText={touched.specialization && errors.specialization}
                >
                  {/* Specialization Options */}
                  <MenuItem value="Cardiology">Cardiology</MenuItem>
                  <MenuItem value="Dermatology">Dermatology</MenuItem>
                  <MenuItem value="Neurology">Neurology</MenuItem>
                  <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                  <MenuItem value="Psychiatry">Psychiatry</MenuItem>
                  <MenuItem value="Radiology">Radiology</MenuItem>
                </Field>
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
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="consultationType"
                  label="Consultation Type"
                  select
                  fullWidth
                  margin="normal"
                  error={touched.consultationType && !!errors.consultationType}
                  helperText={touched.consultationType && errors.consultationType}
                >
                  <MenuItem value="In-person">In-person</MenuItem>
                  <MenuItem value="Virtual">Virtual</MenuItem>
                  <MenuItem value="Both">Both</MenuItem>
                </Field>
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

            {/* Availability Section */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Set Your Availability
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 4 }}>
              {Object.keys(availability).map((day) => (
                <TimeSlotPicker
                  key={day}
                  day={day}
                  dayAvailability={availability[day]}
                  onUpdate={handleAvailabilityUpdate}
                />
              ))}
            </Box>

            {/* Calendar Display */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Your Availability Calendar
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ mb: 4 }}>
              <DoctorAvailabilityCalendar availability={availability} />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Save Profile'}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
}