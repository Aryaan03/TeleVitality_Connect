import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Button, TextField, Box, Typography, 
  MenuItem, FormControlLabel, Checkbox, Alert,
  Card, CardContent, Divider, CircularProgress, useTheme,
  Grid, Avatar, InputAdornment, IconButton
} from '@mui/material';
import { authService } from '../services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Cake as CakeIcon,
  LocalHospital as HospitalIcon,
  AssignmentInd as InsuranceIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`
}));

const SectionHeader = ({ title, icon }) => {
  const theme = useTheme();
  const IconComponent = icon;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
      <Box sx={{
        p: 1,
        borderRadius: '50%',
        bgcolor: theme.palette.primary.light,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.primary.main,
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText
        }
      }}>
        <IconComponent sx={{ fontSize: 22 }} />
      </Box>
      <Typography variant="h6" sx={{ 
        fontWeight: 600,
        color: theme.palette.text.primary,
        letterSpacing: 0.5
      }}>
        {title}
      </Typography>
    </Box>
  );
};

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: `2px solid ${theme.palette.primary.main}`,
  background: theme.palette.background.default,
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

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
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
      setSuccess('');
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 1440, 
      margin: 'auto', 
      p: { xs: 2, md: 4 },
      minHeight: '100vh',
      background: theme.palette.background.default
    }}>
      <StyledCard>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4,
            mb: 6,
            p: 3,
            background: theme.palette.background.paper,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`
          }}>
            <ProfileAvatar>
              {initialValues.firstName[0]}{initialValues.lastName[0]}
            </ProfileAvatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 700,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                color: theme.palette.text.primary
              }}>
                {initialValues.firstName} {initialValues.lastName}
                <IconButton sx={{ 
                  color: theme.palette.primary.main,
                  p: 0.5,
                  '&:hover': {
                    background: 'transparent',
                    color: theme.palette.primary.dark
                  }
                }}>
                  <EditIcon sx={{ fontSize: 28 }} />
                </IconButton>
              </Typography>
              <Typography variant="body1" sx={{ 
                color: theme.palette.text.secondary,
                letterSpacing: 0.3
              }}>
                Patient ID: #{Math.random().toString().slice(2, 8)}
              </Typography>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ 
              mb: 3, 
              borderRadius: 1,
              border: `1px solid ${theme.palette.error.main}`,
              background: theme.palette.error.light
            }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ 
              mb: 3,
              borderRadius: 1,
              border: `1px solid ${theme.palette.success.main}`,
              background: theme.palette.success.light
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
                <Grid container spacing={3}>
                  {/* Personal Information */}
                  <Grid item xs={12} md={6}>
                    <SectionHeader title="Personal Information" icon={PersonIcon} />
                    <Field
                      as={TextField}
                      name="firstName"
                      label="First Name"
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ 
                              fontSize: 22, 
                              color: theme.palette.primary.main,
                              mr: 1 
                            }} />
                          </InputAdornment>
                        ),
                        sx: { 
                          borderRadius: '6px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider
                          }
                        }
                      }}
                      error={touched.firstName && !!errors.firstName}
                      helperText={touched.firstName && errors.firstName}
                    />

                    <Field
                      as={TextField}
                      name="lastName"
                      label="Last Name"
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        sx: { 
                          borderRadius: '6px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider
                          }
                        }
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
                      sx={{ mb: 2 }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CakeIcon sx={{ 
                              fontSize: 22, 
                              color: theme.palette.primary.main,
                              mr: 1 
                            }} />
                          </InputAdornment>
                        ),
                        sx: { 
                          borderRadius: '6px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider
                          }
                        }
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
                      sx={{ mb: 2 }}
                      InputProps={{
                        sx: { 
                          borderRadius: '6px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider
                          }
                        }
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
                    <SectionHeader title="Contact Details" icon={PhoneIcon} />
                    <Field
                      as={TextField}
                      name="phoneNumber"
                      label="Phone Number"
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ 
                              fontSize: 22, 
                              color: theme.palette.primary.main,
                              mr: 1 
                            }} />
                          </InputAdornment>
                        ),
                        sx: { 
                          borderRadius: '6px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider
                          }
                        }
                      }}
                      error={touched.phoneNumber && !!errors.phoneNumber}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                    />

                    <Field
                      as={TextField}
                      name="address"
                      label="Address"
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon sx={{ 
                              fontSize: 22, 
                              color: theme.palette.primary.main,
                              mr: 1 
                            }} />
                          </InputAdornment>
                        ),
                        sx: { 
                          borderRadius: '6px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider
                          }
                        }
                      }}
                      error={touched.address && !!errors.address}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>

                  {/* Medical Information */}
                  <Grid item xs={12}>
                    <SectionHeader title="Medical Information" icon={HospitalIcon} />
                    <Field
                      as={TextField}
                      name="problemDescription"
                      label="Medical Condition Description"
                      fullWidth
                      multiline
                      rows={4}
                      sx={{ mb: 2 }}
                      InputProps={{
                        sx: { 
                          borderRadius: '6px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider
                          }
                        }
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
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HospitalIcon sx={{ 
                              fontSize: 22, 
                              color: theme.palette.primary.main,
                              mr: 1 
                            }} />
                          </InputAdornment>
                        ),
                        sx: { 
                          borderRadius: '6px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider
                          }
                        }
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
                    <SectionHeader title="Insurance Details" icon={InsuranceIcon} />
                    <Field
                      as={TextField}
                      name="insuranceProvider"
                      label="Insurance Provider"
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <InsuranceIcon sx={{ 
                              fontSize: 22, 
                              color: theme.palette.primary.main,
                              mr: 1 
                            }} />
                          </InputAdornment>
                        ),
                        sx: { 
                          borderRadius: '6px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider
                          }
                        }
                      }}
                      error={touched.insuranceProvider && !!errors.insuranceProvider}
                      helperText={touched.insuranceProvider && errors.insuranceProvider}
                    />

                    <Field
                      as={TextField}
                      name="insurancePolicyNumber"
                      label="Policy Number"
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        sx: { 
                          borderRadius: '6px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider
                          }
                        }
                      }}
                      error={touched.insurancePolicyNumber && !!errors.insurancePolicyNumber}
                      helperText={touched.insurancePolicyNumber && errors.insurancePolicyNumber}
                    />
                  </Grid>

                  {/* Preferences */}
                  <Grid item xs={12} md={6}>
                    <SectionHeader title="Preferences" icon={NotificationsIcon} />
                    <Field
                      as={TextField}
                      name="preferredCommunication"
                      label="Preferred Communication"
                      select
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        sx: { 
                          borderRadius: '6px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider
                          }
                        }
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
                          sx={{ 
                            '& .MuiSvgIcon-root': { fontSize: 24 },
                            color: theme.palette.primary.main
                          }}
                        />
                      }
                      label={
                        <Typography variant="body1" sx={{ 
                          color: theme.palette.text.primary,
                          fontWeight: 500
                        }}>
                          I consent to telemedicine services
                        </Typography>
                      }
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'divider' }} />

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  gap: 2,
                  px: 2,
                  py: 2
                }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="medium"
                    sx={{
                      px: 6,
                      py: 1,
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                        boxShadow: theme.shadows[2]
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={22} sx={{ color: 'inherit' }} />
                    ) : 'Save Changes'}
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