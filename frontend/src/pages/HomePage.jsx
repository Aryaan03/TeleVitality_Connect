import { Button, Stack, Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';

export default function HomePage({ onGetStartedClick, onLoginClick }) {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ py: 8, backgroundColor: '#1976d2', color: 'white' }}>
          <Container>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Welcome to TeleVitality Connect
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Your Trusted Partner in Medical Care
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button 
                variant="contained" 
                color="secondary" 
                size="large" 
                // href="/register"
                onClick={onGetStartedClick}
              >
                Get Started
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                size="large" 
                // href="/login"
                onClick={onLoginClick}
              >
                Login
              </Button>
            </Stack>
          </Container>
        </Box>

        {/* Features Section */}
        <Container sx={{ py: 8 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Why Choose Us?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Card elevation={4}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>24/7 Support</Typography>
                  <Typography>Round-the-clock assistance for emergencies.</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={4}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>Expert Doctors</Typography>
                  <Typography>Qualified specialists across 25+ fields.</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={4}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>Digital Records</Typography>
                  <Typography>Secure access to your medical history.</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        py: 4,
        backgroundColor: '#333', 
        color: 'white',
        mt: 'auto'  // This pushes the footer to the bottom
      }}>
        <Container>
          <Typography align="center">
            © 2025 TeleVitality Connect. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}