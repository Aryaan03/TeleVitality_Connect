import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Button, TextField, Box, Typography, 
  MenuItem, Alert, Card, CardContent, 
  Divider, CircularProgress, useTheme,
  Grid, Avatar, InputAdornment, IconButton
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  LocalHospital as HospitalIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as LicenseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import DoctorAvailabilityCalendar from '../components/DoctorAvailabilityCalendar';
import TimeSlotPicker from '../components/TimeSlotPicker';
import { authService } from '../services/api';
import { appointmentService } from '../services/appointmentService';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: `2px solid ${theme.palette.primary.main}`,
  background: theme.palette.background.default,
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
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

export default function DoctorProfilePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialValues, setInitialValues] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState({
    specialties: false,
    docprofile: false,
  });

  const [availability, setAvailability] = useState({
    // ... same availability initial state ...
  });

  // ... keep all existing useEffect hooks and data fetching logic ...

  const validationSchema = Yup.object({
    // ... keep existing validation schema ...
  });

  const handleSubmit = async (values) => {
    // ... keep existing submit logic ...
  };

  const handleAvailabilityUpdate = (day, dayAvailability) => {
    // ... keep existing availability update logic ...
  };

  if (loading.docprofile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

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
              {initialValues?.firstName?.[0]}{initialValues?.lastName?.[0]}
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
                Dr. {initialValues?.firstName} {initialValues?.lastName}
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
                {initialValues?.specialization}
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
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Field>
                  </Grid>

                  {/* Professional Information */}
                  <Grid item xs={12} md={6}>
                    <SectionHeader title="Professional Details" icon={HospitalIcon} />
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
                      name="medicalLicenseNumber"
                      label="Medical License"
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LicenseIcon sx={{ 
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
                      error={touched.medicalLicenseNumber && !!errors.medicalLicenseNumber}
                      helperText={touched.medicalLicenseNumber && errors.medicalLicenseNumber}
                    />

                    <Field
                      as={TextField}
                      name="specialization"
                      label="Specialization"
                      select
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <WorkIcon sx={{ 
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
                    >
                      {loading.specialties ? (
                        <MenuItem disabled><CircularProgress size={20} /> Loading...</MenuItem>
                      ) : specialties.map((speciality) => (
                        <MenuItem key={speciality.id} value={speciality.name}>
                          {speciality.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>

                  {/* Availability Section */}
                  <Grid item xs={12}>
                    <SectionHeader title="Availability" icon={CalendarIcon} />
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

                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Availability Calendar
                    </Typography>
                    <DoctorAvailabilityCalendar availability={availability} />
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