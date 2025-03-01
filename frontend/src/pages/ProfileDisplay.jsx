// ProfileDisplay.jsx
import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
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

export default function ProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getProfile();
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
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Patient ID: #{profile.id}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate('/profile/edit')}
              sx={{ borderRadius: 8, px: 4, py: 1.5 }}
            >
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Main Content */}
          <Grid container spacing={4}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <SectionHeader title="Personal Information" />
              <InfoItem label="Date of Birth" value={new Date(profile.dateOfBirth).toLocaleDateString()} />
              <InfoItem label="Gender" value={profile.gender} />
              <InfoItem label="Insurance Provider" value={profile.insuranceProvider} />
              <InfoItem label="Policy Number" value={profile.insurancePolicyNumber} />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <SectionHeader title="Contact Details" />
              <InfoItem label="Email" value={profile.email} />
              <InfoItem label="Phone" value={profile.phoneNumber} />
              <InfoItem label="Address" value={profile.address} />
              <InfoItem 
                label="Preferred Communication" 
                value={profile.preferredCommunication} 
              />
            </Grid>

            {/* Medical Information */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 4, background: '#f8f9fa' }}>
                <SectionHeader title="Medical Information" />
                <Typography variant="body1" paragraph>
                  {profile.problemDescription}
                </Typography>
                <InfoItem 
                  label="Preferred Doctor" 
                  value={profile.preferredDoctor} 
                />
                <InfoItem 
                  label="Telemedicine Consent" 
                  value={profile.consentTelemedicine ? 'Granted' : 'Not Granted'} 
                />
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>
    </Box>
  );
}