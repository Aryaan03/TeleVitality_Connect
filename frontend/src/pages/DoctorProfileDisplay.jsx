import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            pt: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                width: 96, 
                height: 96, 
                mr: 3,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                color: 'common.white'
              }}>
                {profile.firstName[0]}{profile.lastName[0]}
              </Avatar>
              <Box>
                <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                  Dr. {profile.firstName} {profile.lastName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <LicenseIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">
                    #{profile.medicalLicenseNumber}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate('/doctor/edit-profile')}
              sx={{ 
                borderRadius: 2, 
                px: 3, 
                py: 1,
                fontWeight: 500,
                textTransform: 'none',
                borderWidth: 1.5,
                '&:hover': {
                  borderWidth: 1.5
                }
              }}
            >
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Main Content */}
          <Grid container spacing={4}>
            {/* Professional Information */}
            <Grid item xs={12} md={6}>
              <SectionHeader 
                title="Professional Information" 
                icon={<WorkIcon fontSize="small" />}
              />
              <InfoItem 
                label="Specialization" 
                value={profile.specialization} 
                icon={<HospitalIcon fontSize="small" />}
              />
              <InfoItem 
                label="Years of Experience" 
                value={profile.yearsOfExperience} 
                icon={<CalendarIcon fontSize="small" />}
              />
              <InfoItem 
                label="Medical Board" 
                value={profile.issuingMedicalBoard} 
                icon={<BoardIcon fontSize="small" />}
              />
              <InfoItem 
                label="License Expiry" 
                value={new Date(profile.licenseExpiryDate).toLocaleDateString()} 
                icon={<LicenseIcon fontSize="small" />}
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <SectionHeader 
                title="Contact Details" 
                icon={<PhoneIcon fontSize="small" />}
              />
              <InfoItem 
                label="Phone" 
                value={profile.phoneNumber} 
                icon={<PhoneIcon fontSize="small" />}
              />
              <InfoItem 
                label="Work Address" 
                value={profile.workAddress} 
                icon={<LocationIcon fontSize="small" />}
              />
              <InfoItem 
                label="Hospital" 
                value={profile.hospitalName} 
                icon={<HospitalIcon fontSize="small" />}
              />
            </Grid>

            {/* Practice Information */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ 
                p: 3, 
                borderRadius: 2,
                backgroundColor: 'background.default'
              }}>
                <SectionHeader 
                  title="Practice Details" 
                  icon={<WorkIcon fontSize="small" />}
                />
                <InfoItem 
                  label="Consultation Type" 
                  value={profile.consultationType} 
                  icon={<HospitalIcon fontSize="small" />}
                />
                <Box sx={{ 
                  mb: 3,
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant="body1" sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.6
                  }}>
                    {profile.description || "No additional practice information provided."}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Availability Section */}
            {profile.availability && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  backgroundColor: 'background.default'
                }}>
                  <SectionHeader 
                    title="Availability Schedule" 
                    icon={<CalendarIcon fontSize="small" />}
                  />
                  {Object.entries(JSON.parse(profile.availability)).map(([day, details]) => (
                    details.enabled && (
                      <InfoItem
                        key={day}
                        label={day}
                        value={details.timeSlots.map(slot => `${slot.startTime} - ${slot.endTime}`).join(', ')}
                        icon={<CalendarIcon fontSize="small" />}
                      />
                    )
                  ))}
                </Paper>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </StyledCard>
    </Box>
  );
}