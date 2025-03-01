import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Button, TextField, Box, Typography, 
  MenuItem, FormControlLabel, Checkbox, Alert,
  Card, CardContent, Divider, CircularProgress, useTheme
} from '@mui/material';
import { authService } from '../services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)'
  },
}));

const SectionHeader = ({ title }) => {
  const theme = useTheme();
  return (
    <Typography variant="h6" sx={{ 
      mb: 3,
      color: theme.palette.primary.main,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      '&:before': {
        content: '""',
        display: 'block',
        width: '4px',
        height: '24px',
        backgroundColor: theme.palette.primary.main,
        borderRadius: '2px'
      }
    }}>
      {title}
    </Typography>
  );
};

export default function ProfilePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getProfile();
        setInitialValues(profileData);
        setError('');
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Unable to load profile. Please try again later.');
      }
    };
    fetchProfile();
  }, []);

  if (initialValues === null) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress size={60} thickness={4} />
    </Box>
  );

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
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
      setSuccess('');
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      margin: 'auto', 
      p: 3,
      background: 'linear-gradient(to bottom right, #f8f9fa 0%, #ffffff 100%)',
      minHeight: '100vh'
    }}>
      <StyledCard>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            p: 3,
            background: theme.palette.primary.light,
            borderRadius: '12px'
          }}>
            <Typography variant="h3" sx={{ 
              color: theme.palette.primary.contrastText,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <EditIcon fontSize="large" />
              Patient Profile
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ 
              mb: 3, 
              borderRadius: 2,
              boxShadow: theme.shadows[1]
            }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ 
              mb: 3,
              borderRadius: 2,
              boxShadow: theme.shadows[1]
            }}>
              {success}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Grid container spacing={4} sx={{ p: 3 }}>
                  {/* Personal Information */}
                  <Grid item xs={12} md={6}>
                    <SectionHeader title="Personal Information" />
                    <Field
                      as={TextField}
                      name="firstName"
                      label="First Name"
                      fullWidth
                      sx={{ mb: 3 }}
                      InputProps={{
                        sx: { borderRadius: '8px' }
                      }}
                      error={touched.firstName && !!errors.firstName}
                      helperText={touched.firstName && errors.firstName}
                    />

                    <Field
                      as={TextField}
                      name="lastName"
                      label="Last Name"
                      fullWidth
                      sx={{ mb: 3 }}
                      InputProps={{
                        sx: { borderRadius: '8px' }
                      }}
                      error={touched.lastName && !!errors.lastName}
                      helperText={touched.lastName && errors.lastName}
                    />

                    <Field
                      as={TextField}
                      name="dateOfBirth"
                      label="Date of Birth"
                      type="date"
                      fullWidth
                      sx={{ mb: 3 }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        sx: { borderRadius: '8px' }
                      }}
                      error={touched.dateOfBirth && !!errors.dateOfBirth}
                      helperText={touched.dateOfBirth && errors.dateOfBirth}
                    />

                    <Field
                      as={TextField}
                      name="gender"
                      label="Gender"
                      select
                      fullWidth
                      sx={{ mb: 3 }}
                      InputProps={{
                        sx: { borderRadius: '8px' }
                      }}
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
                    <SectionHeader title="Contact Details" />
                    <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      fullWidth
                      sx={{ mb: 3 }}
                      InputProps={{
                        sx: { borderRadius: '8px' }
                      }}
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                    />

                    <Field
                      as={TextField}
                      name="phoneNumber"
                      label="Phone Number"
                      fullWidth
                      sx={{ mb: 3 }}
                      InputProps={{
                        sx: { borderRadius: '8px' }
                      }}
                      error={touched.phoneNumber && !!errors.phoneNumber}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                    />

                    <Field
                      as={TextField}
                      name="address"
                      label="Address"
                      fullWidth
                      sx={{ mb: 3 }}
                      InputProps={{
                        sx: { borderRadius: '8px' }
                      }}
                      error={touched.address && !!errors.address}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>

                  {/* Medical Information */}
                  <Grid item xs={12}>
                    <SectionHeader title="Medical Information" />
                    <Field
                      as={TextField}
                      name="problemDescription"
                      label="Medical Condition Description"
                      fullWidth
                      multiline
                      rows={4}
                      sx={{ mb: 3 }}
                      InputProps={{
                        sx: { borderRadius: '12px' }
                      }}
                      error={touched.problemDescription && !!errors.problemDescription}
                      helperText={touched.problemDescription && errors.problemDescription}
                    />

                    <Field
                      as={TextField}
                      name="preferredDoctor"
                      label="Preferred Doctor"
                      select
                      fullWidth
                      sx={{ mb: 3 }}
                      InputProps={{
                        sx: { borderRadius: '8px' }
                      }}
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
                    <SectionHeader title="Insurance Details" />
                    <Field
                      as={TextField}
                      name="insuranceProvider"
                      label="Insurance Provider"
                      fullWidth
                      sx={{ mb: 3 }}
                      InputProps={{
                        sx: { borderRadius: '8px' }
                      }}
                      error={touched.insuranceProvider && !!errors.insuranceProvider}
                      helperText={touched.insuranceProvider && errors.insuranceProvider}
                    />

                    <Field
                      as={TextField}
                      name="insurancePolicyNumber"
                      label="Policy Number"
                      fullWidth
                      sx={{ mb: 3 }}
                      InputProps={{
                        sx: { borderRadius: '8px' }
                      }}
                      error={touched.insurancePolicyNumber && !!errors.insurancePolicyNumber}
                      helperText={touched.insurancePolicyNumber && errors.insurancePolicyNumber}
                    />
                  </Grid>

                  {/* Preferences */}
                  <Grid item xs={12} md={6}>
                    <SectionHeader title="Preferences" />
                    <Field
                      as={TextField}
                      name="preferredCommunication"
                      label="Preferred Communication"
                      select
                      fullWidth
                      sx={{ mb: 3 }}
                      InputProps={{
                        sx: { borderRadius: '8px' }
                      }}
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
                          sx={{ 
                            '& .MuiSvgIcon-root': { fontSize: 28 },
                            color: theme.palette.primary.main
                          }}
                        />
                      }
                      label={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          I consent to telemedicine services
                        </Typography>
                      }
                      sx={{ mt: 2 }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  px: 3,
                  pb: 3
                }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large"
                    sx={{
                      px: 6,
                      py: 1.5,
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : 'Save Profile'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </StyledCard>
    </Box>
  );
}