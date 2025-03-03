import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api'; // Replace with your actual API service
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
}));

const InfoItem = ({ label, value }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={4}>
      <Typography variant="subtitle1" color="text.secondary">
        {label}
      </Typography>
    </Grid>
    <Grid item xs={8}>
      <Typography variant="body1" fontWeight="medium">
        {value || '-'}
      </Typography>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title }) => (
  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
    {title}
  </Typography>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile(); // Fetch doctor profile data
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
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 4 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                width: 100, 
                height: 100, 
                mr: 3,
                bgcolor: 'primary.main',
                fontSize: '2.5rem'
              }}>
                {profile.firstName[0]}{profile.lastName[0]}
              </Avatar>
              <Box>
                <Typography variant="h3" component="div">
                  Dr. {profile.firstName} {profile.lastName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Doctor ID: #{profile.id}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate('/doctor/edit-profile')}
              sx={{ borderRadius: 8, px: 4, py: 1.5 }}
            >
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Main Content */}
          <Grid container spacing={4}>
            {/* Professional Information */}
            <Grid item xs={12} md={6}>
              <SectionHeader title="Professional Information" />
              <InfoItem label="Specialization" value={profile.specialization} />
              <InfoItem label="Years of Experience" value={profile.yearsOfExperience} />
              <InfoItem label="License Number" value={profile.medicalLicenseNumber} />
              <InfoItem label="Issuing Medical Board" value={profile.issuingMedicalBoard} />
              <InfoItem label="License Expiry Date" value={new Date(profile.licenseExpiryDate).toLocaleDateString()} />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <SectionHeader title="Contact Details" />
              <InfoItem label="Email" value={profile.email} />
              <InfoItem label="Phone Number" value={profile.phoneNumber} />
              <InfoItem label="Work Address" value={profile.workAddress} />
              <InfoItem label="Hospital Name" value={profile.hospitalName} />
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 4, background: '#f8f9fa' }}>
                <SectionHeader title="Additional Information" />
                <Typography variant="body1" paragraph>
                  {profile.description || "No additional information provided."}
                </Typography>
                <InfoItem label="Consultation Type" value={profile.consultationType} />
              </Paper>
            </Grid>

            {/* Availability Section */}
            {profile.availability && (
              <>
                <Grid item xs={12}>
                  <SectionHeader title="Availability Schedule" />
                  {Object.entries(JSON.parse(profile.availability)).map(([day, details]) => (
                    details.enabled ? (
                      <Typography key={day} variant="body1">
                        {day}: {details.timeSlots.map(slot => `${slot.startTime} - ${slot.endTime}`).join(', ')}
                      </Typography>
                    ) : null
                  ))}
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </StyledCard>
    </Box>
  );
}
