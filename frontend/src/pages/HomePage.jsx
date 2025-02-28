import { Button, Stack, Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { MedicalServices, AccessTime, VerifiedUser, FormatQuote } from '@mui/icons-material';

export default function HomePage({ onGetStartedClick, onLoginClick }) {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      backgroundImage: 'linear-gradient(45deg, #f8f9fa 0%, #e9ecef 100%)'
    }}>
      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ 
          py: 10, 
          background: 'linear-gradient(135deg, #1976d2 0%, #115293 100%)',
          color: 'white',
          boxShadow: 3
        }}>
          <Container>
            <Box sx={{ 
              maxWidth: '800px', 
              mx: 'auto', 
              textAlign: 'center',
              animation: 'fadeIn 1s ease-in'
            }}>
              <Typography variant="h2" gutterBottom sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 3
              }}>
                Welcome to TeleVitality Connect
              </Typography>
              <Typography variant="h5" sx={{ 
                mb: 5,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                opacity: 0.9
              }}>
                Bridging Distance with Medical Excellence
              </Typography>
              <Stack direction="row" spacing={3} justifyContent="center">
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  onClick={onGetStartedClick}
                  sx={{
                    px: 5,
                    borderRadius: '50px',
                    '&:hover': { transform: 'translateY(-2px)' }
                  }}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  size="large"
                  onClick={onLoginClick}
                  sx={{
                    px: 5,
                    borderRadius: '50px',
                    borderWidth: '2px',
                    '&:hover': { 
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderWidth: '2px'
                    }
                  }}
                >
                  Login
                </Button>
              </Stack>
            </Box>
          </Container>
        </Box>

        {/* Features Section */}
        <Container sx={{ py: 10 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ 
            fontWeight: 'bold',
            mb: 8,
            color: 'text.primary',
            position: 'relative',
            '&:after': {
              content: '""',
              display: 'block',
              width: '60px',
              height: '4px',
              backgroundColor: 'secondary.main',
              margin: '20px auto 0'
            }
          }}>
            Why Choose Us?
          </Typography>
          <Grid container spacing={4}>
            {[
              { icon: <AccessTime fontSize="large" />, title: '24/7 Support', text: 'Immediate access to medical professionals anytime, anywhere' },
              { icon: <MedicalServices fontSize="large" />, title: 'Expert Doctors', text: 'Board-certified specialists across 25+ medical fields' },
              { icon: <VerifiedUser fontSize="large" />, title: 'Secure Records', text: 'Military-grade encryption for your health data' }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  borderRadius: 2,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ 
                    textAlign: 'center',
                    py: 5,
                    px: 3
                  }}>
                    <Box sx={{
                      color: 'secondary.main',
                      mb: 2,
                      '& .MuiSvgIcon-root': { fontSize: '3.5rem' }
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ 
                      fontWeight: '600',
                      color: 'text.primary'
                    }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: 'text.secondary',
                      lineHeight: 1.6
                    }}>
                      {feature.text}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Testimonials Section */}
        <Box sx={{ py: 10, backgroundColor: 'rgba(25, 118, 210, 0.05)' }}>
          <Container>
            <Typography variant="h4" align="center" gutterBottom sx={{ 
              fontWeight: 'bold',
              mb: 8,
              color: 'text.primary',
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                width: '60px',
                height: '4px',
                backgroundColor: 'secondary.main',
                margin: '20px auto 0'
              }
            }}>
              What Our Patients Say
            </Typography>
            <Grid container spacing={4}>
              {[
                { 
                  quote: "TeleVitality Connect changed my life! The doctors are amazing and available 24/7.",
                  author: "John Doe"
                },
                { 
                  quote: "I always feel safe and well cared for. The digital records and quick response time are exceptional.",
                  author: "Jane Smith"
                },
                { 
                  quote: "A truly modern approach to healthcare. Highly recommended for everyone!",
                  author: "Alex Brown"
                }
              ].map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ 
                    borderRadius: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <FormatQuote sx={{ 
                        color: 'text.secondary',
                        fontSize: '3rem',
                        transform: 'rotate(180deg)',
                        mb: -2
                      }} />
                      <Typography variant="body1" sx={{ 
                        fontStyle: 'italic',
                        color: 'text.primary',
                        lineHeight: 1.6,
                        mb: 2
                      }}>
                        {testimonial.quote}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 'bold',
                        color: 'secondary.main'
                      }}>
                        – {testimonial.author}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        py: 4,
        backgroundColor: '#1a237e',
        color: 'rgba(255,255,255,0.9)',
        mt: 'auto'
      }}>
        <Container>
          <Typography align="center" variant="body2" sx={{ letterSpacing: 0.5 }}>
            © 2025 TeleVitality Connect. All rights reserved.<br />
            Committed to Your Health, Powered by Innovation
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}