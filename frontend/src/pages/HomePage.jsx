import React, { useRef } from 'react';
import { 
  Button, Container, Typography, Box, Grid, Card, CardContent, TextField, 
  Avatar, List, ListItem, ListItemText, Stack, IconButton, Divider,
  Rating, Chip
} from '@mui/material';
import { 
  AccessTime, VerifiedUser, CheckCircle, FormatQuote, 
  PlayArrow, ArrowForward, Facebook, Twitter, Instagram, LinkedIn,
  Phone, Email, LocationOn, HealthAndSafety, PersonSearch,
  CalendarMonth, VideoCall, Shield, SupportAgent, AutoGraph, Devices
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import Docimg from '../assets/Doc1.avif';
import Pat1img from '../assets/Pat1.avif';
import Pat2img from '../assets/Pat2.avif';
import HeroSection from '../assets/HeroSection.avif';
import GetStarted from '../assets/GetStarted.jpeg';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const gradientBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export default function HomePage({ onGetStartedClick, onLoginClick }) {
  // Create refs for each section
  const topRef = useRef(null);
  const featuresRef = useRef(null);
  const processRef = useRef(null);
  const pricingRef = useRef(null);
  const testimonialsRef = useRef(null);

  const scrollToRef = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop - 100,
      behavior: 'smooth'
    });
  };

  // Testimonials data with updated ratings
  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Family Physician",
      image: Docimg,
      rating: 5,
      text: "TeleVitality has transformed my practice. I can now connect with patients from anywhere, maintaining the same quality of care while saving time for both me and my patients."
    },
    {
      name: "Emily Rodriguez",
      role: "Patient",
      image: Pat2img,
      rating: 4.75,
      text: "I always feel safe and well cared for. The digital records and quick response time are exceptional. A truly modern approach to healthcare. Highly recommended for everyone!"
    },
    {
      name: "Michael Thompson",
      role: "Patient",
      image: Pat1img,
      rating: 4.5,
      text: "As someone with a chronic condition, being able to consult with my specialist without traveling has been life-changing. The platform is intuitive and the video quality is excellent."
    }
  ];

  // Features data
  const features = [
    { 
      icon: <VideoCall sx={{ fontSize: 40 }} />, 
      title: 'HD Video Consultations', 
      text: 'Crystal-clear video calls with adaptive bandwidth for any connection' 
    },
    { 
      icon: <Shield sx={{ fontSize: 40 }} />, 
      title: 'HIPAA Compliant', 
      text: 'Military-grade encryption and secure data handling' 
    },
    { 
      icon: <CalendarMonth sx={{ fontSize: 40 }} />, 
      title: 'Smart Scheduling', 
      text: 'Smart appointment booking with automatic reminders' 
    },
    { 
      icon: <AutoGraph sx={{ fontSize: 40 }} />, 
      title: 'Practice Analytics', 
      text: 'Comprehensive dashboards to track patient appointments and medical reports management' 
    },
    { 
      icon: <Devices sx={{ fontSize: 40 }} />, 
      title: 'Multi-Device Support', 
      text: 'Seamless experience across desktop, tablet, and mobile devices' 
    }
  ];
  
  // Stats 
  const stats = [
    { number: "94.5%", label: "Patient Satisfaction" },
    { number: "10K+", label: "Consultations Monthly" },
    { number: "450+", label: "Healthcare Providers" },
    { number: "50+", label: "Medical Specialties" }
  ];
  
  // Updated Pricing plans
  const plans = [
    {
      title: "Basic",
      subtitle: "For individual healthcare needs",
      price: "Free",
      period: "forever",
      features: [
        "3 consultations/month", 
        "Basic medical records", 
        "Email support", 
        "Secure messaging",
        "HIPAA compliant",
        "Health tips & resources"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      title: "Premium",
      subtitle: "For comprehensive care",
      price: "$29",
      period: "per month",
      features: [
        "Unlimited consultations", 
        "Priority appointments", 
        "24/7 support", 
        "Prescription refills",
        "Health analytics",
        "Family sharing (up to 3)"
      ],
      cta: "Get Started",
      highlighted: true
    },
    {
      title: "Family",
      subtitle: "For family healthcare",
      price: "$49",
      period: "per month",
      features: [
        "Up to 6 family members", 
        "Shared medical records", 
        "Group consultations", 
        "Advanced analytics",
        "Custom health alerts",
        "Premium support"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <Box sx={{ 
      bgcolor: '#FBFDFF', 
      color: '#2D3748', 
      fontFamily: "'Inter', sans-serif",
      overflowX: 'hidden'
    }}>
      {/* Hero Section */}
      <Box ref={topRef} id="top" sx={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #147EFF 0%, #0E5FD9 100%)',
        color: 'white',
        pt: { xs: 15, md: 20 },
        pb: { xs: 15, md: 20 },
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          backgroundImage: `url(${HeroSection})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.65,
          clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ animation: `${fadeIn} 0.8s ease-out` }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' }, 
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 3,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  Telemedicine that <Box component="span" sx={{ color: '#A5D6FF' }}>puts patients first</Box>
                </Typography>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 400,
                    mb: 5,
                    opacity: 0.9,
                    maxWidth: '90%'
                  }}
                >
                  Streamline your practice with our secure, intuitive telehealth platform designed for doctors and patients.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={onGetStartedClick}
                    sx={{
                      bgcolor: 'white',
                      color: '#147EFF',
                      fontSize: '1rem',
                      fontWeight: 600,
                      py: 1.5,
                      px: 4,
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(20, 126, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 15px 30px rgba(20, 126, 255, 0.3)'
                      }
                    }}
                  >
                    Start Free Trial
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 600,
                      py: 1.5,
                      px: 4,
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Watch Demo
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Stats Section */}
      <Container maxWidth="lg">
        <Box 
          sx={{
            mt: -6,
            py: 4,
            px: { xs: 3, md: 6 },
            borderRadius: '16px',
            bgcolor: 'white',
            boxShadow: '0 20px 40px rgba(20, 126, 255, 0.15)',
            position: 'relative',
            zIndex: 3,
            border: '1px solid rgba(20, 126, 255, 0.1)'
          }}
        >
          <Grid container spacing={2}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index} sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800, 
                    color: '#147EFF',
                    fontSize: { xs: '1.75rem', md: '2.5rem' },
                    mb: 1
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography variant="body1" sx={{ color: '#718096', fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Why Choose Us Section */}
      <Box ref={featuresRef} id="features" sx={{ py: 12, pt: 6, scrollMarginTop: '96px', position: 'relative'}}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography 
              variant="h5" 
              component="span"
              sx={{ 
                color: '#147EFF', 
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1,
                display: 'inline-block',
                background: 'linear-gradient(90deg, rgba(20,126,255,0.1) 0%, rgba(20,126,255,0.3) 100%)',
                px: 3,
                py: 1,
                borderRadius: '20px'
              }}
            >
              Why Choose Us?
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                mt: 3,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 800,
                lineHeight: 1.2
              }}
            >
              Revolutionizing <Box component="span" sx={{ color: '#147EFF' }}>Healthcare</Box> Delivery
            </Typography>
            <Typography variant="h6" sx={{ color: '#718096', maxWidth: '700px', mx: 'auto' }}>
              Our platform combines cutting-edge technology with compassionate care to deliver exceptional telehealth experiences.
            </Typography>
          </Box>
          
          <Grid container spacing={3} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  data-testid="feature-card"
                  sx={{ 
                    height: '70%',
                    p: 4,
                    borderRadius: '16px',
                    border: '1px solid rgba(20, 126, 255, 0.1)',
                    boxShadow: '0 10px 30px rgba(20, 126, 255, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 35px rgba(20, 126, 255, 0.1)',
                      borderColor: 'rgba(20, 126, 255, 0.2)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, rgba(20,126,255,0.1) 0%, rgba(20,126,255,0.2) 100%)',
                      color: '#147EFF'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#718096' }}>
                    {feature.text}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box ref={processRef} id="process" sx={{ py: 8, pt: 6, crollMarginTop: '96px', bgcolor: '#F7FAFF', position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 20% 30%, rgba(20,126,255,0.05) 0%, transparent 50%)',
            zIndex: 0
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography 
              variant="h5" 
              component="span"
              sx={{ 
                color: '#147EFF', 
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1,
                display: 'inline-block',
                background: 'linear-gradient(90deg, rgba(20,126,255,0.1) 0%, rgba(20,126,255,0.3) 100%)',
                px: 3,
                py: 1,
                borderRadius: '20px'
              }}
            >
              Simple Process
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                mt: 3,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 800,
                lineHeight: 1.2
              }}
            >
              How <Box component="span" sx={{ color: '#147EFF' }}>TeleVitality</Box> Works
            </Typography>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                step: "01",
                title: "Sign Up & Create Profile",
                description: "Create your account and set up your secure medical profile in minutes.",
                icon: <PersonSearch sx={{ fontSize: 40 }} />
              },
              {
                step: "02",
                title: "Find Doctors and Specialists",
                description: "Search from our network of certified doctors and specialists.",
                icon: <CalendarMonth sx={{ fontSize: 40 }} />
              },
              {
                step: "03",
                title: "Book Appointment",
                description: "Book appointments in available time slots and connect with doctors.",
                icon: <HealthAndSafety sx={{ fontSize: 40 }} />
              },
              {
                step: "04",
                title: "Start Consulting",
                description: "Connect via HD video calls and access medical records post-consultation.",
                icon: <VideoCall sx={{ fontSize: 40 }} />
              }
            ].map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: '16px',
                    border: '1px solid rgba(20, 126, 255, 0.1)',
                    boxShadow: '0 10px 30px rgba(20, 126, 255, 0.05)',
                    transition: 'all 0.3s ease',
                    overflow: 'visible',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 15px 35px rgba(20, 126, 255, 0.1)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: '#147EFF',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      boxShadow: '0 10px 20px rgba(20, 126, 255, 0.3)'
                    }}
                  >
                    {step.step}
                  </Box>
                  <CardContent sx={{ pt: 6, pb: 4, px: 4 }}>
                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '20px',
                        bgcolor: 'rgba(20, 126, 255, 0.1)',
                        color: '#147EFF',
                        mb: 3,
                        mx: 'auto'
                      }}
                    >
                      {step.icon}
                    </Box>
                    
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#2D3748', textAlign: 'center' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#718096', textAlign: 'center' }}>
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box ref={pricingRef} id="pricing" sx={{ py: 12, pt: 4, bgcolor: '#F7FAFF', position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(20,126,255,0.03) 0%, transparent 100%)',
            zIndex: 0
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography 
              variant="h5" 
              component="span"
              sx={{ 
                color: '#147EFF', 
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1,
                display: 'inline-block',
                background: 'linear-gradient(90deg, rgba(20,126,255,0.1) 0%, rgba(20,126,255,0.3) 100%)',
                px: 3,
                py: 1,
                borderRadius: '20px'
              }}
            >
              Simple Pricing
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                mt: 3,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 800,
                lineHeight: 1.2
              }}
            >
              Affordable <Box component="span" sx={{ color: '#147EFF' }}>Plans</Box> for Everyone
            </Typography>
            <Typography variant="h6" sx={{ color: '#718096', maxWidth: '700px', mx: 'auto' }}>
              Choose the perfect plan for your healthcare needs. No hidden fees, cancel anytime.
            </Typography>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  data-testid="pricing-card"
                  sx={{
                    height: '100%',
                    borderRadius: '16px',
                    border: plan.highlighted ? '2px solid #147EFF' : '1px solid #E2E8F0',
                    boxShadow: plan.highlighted ? '0 15px 35px rgba(20, 126, 255, 0.15)' : '0 10px 25px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: plan.highlighted 
                        ? '0 20px 40px rgba(20, 126, 255, 0.2)' 
                        : '0 15px 35px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  {plan.highlighted && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bgcolor: '#147EFF',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderBottomLeftRadius: '8px'
                      }}
                    >
                      POPULAR
                    </Box>
                  )}
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                      {plan.title}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#718096', mb: 3 }}>
                      {plan.subtitle}
                    </Typography>
                    
                    <Box sx={{ mb: 4 }}>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 800,
                          color: '#147EFF',
                          display: 'inline-block',
                          mr: 1
                        }}
                      >
                        {plan.price}
                      </Typography>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          color: '#718096',
                          display: 'inline-block'
                        }}
                      >
                        {plan.period}
                      </Typography>
                    </Box>
                    
                    <List dense sx={{ mb: 4 }}>
                      {plan.features.map((feature, i) => (
                        <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1.5, color: '#147EFF' }}>
                            <CheckCircle fontSize="small" />
                          </Box>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                              variant: 'body1',
                              sx: { color: '#4A5568' }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Button
                      variant={plan.highlighted ? 'contained' : 'outlined'}
                      fullWidth
                      size="large"
                      onClick={onGetStartedClick}
                      sx={{
                        mt: 2,
                        bgcolor: plan.highlighted ? '#147EFF' : 'transparent',
                        color: plan.highlighted ? 'white' : '#147EFF',
                        borderColor: '#147EFF',
                        fontWeight: 600,
                        py: 1.5,
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: plan.highlighted ? '#0E5FD9' : 'rgba(20, 126, 255, 0.05)',
                          borderColor: '#0E5FD9',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box ref={testimonialsRef} id="testimonials" sx={{ py: 12,pt: 4, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'radial-gradient(circle at 80% 50%, rgba(20,126,255,0.05) 0%, transparent 70%)',
            zIndex: 0
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography 
              variant="h5" 
              component="span"
              sx={{ 
                color: '#147EFF', 
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1,
                display: 'inline-block',
                background: 'linear-gradient(90deg, rgba(20,126,255,0.1) 0%, rgba(20,126,255,0.3) 100%)',
                px: 3,
                py: 1,
                borderRadius: '20px'
              }}
            >
              Success Stories
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                mt: 3,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 800,
                lineHeight: 1.2
              }}
            >
              Trusted by <Box component="span" sx={{ color: '#147EFF' }}>Thousands</Box>
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  data-testid="testimonial-card"
                  sx={{ 
                    height: '100%',
                    borderRadius: '16px',
                    border: '1px solid rgba(20, 126, 255, 0.1)',
                    boxShadow: '0 10px 30px rgba(20, 126, 255, 0.05)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 35px rgba(20, 126, 255, 0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <FormatQuote 
                      sx={{ 
                        fontSize: 50, 
                        color: 'rgba(20, 126, 255, 0.2)',
                        mb: 1
                      }} 
                    />
                    <Typography variant="body1" paragraph sx={{ mb: 3, color: '#4A5568', fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </Typography>
                    <Divider sx={{ my: 3, borderColor: 'rgba(20, 126, 255, 0.1)' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={testimonial.image} 
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          mr: 2,
                          border: '2px solid rgba(20, 126, 255, 0.2)'
                        }} 
                      />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#718096' }}>
                          {testimonial.role}
                        </Typography>
                        <Rating 
                          value={testimonial.rating} 
                          precision={0.25} 
                          readOnly 
                          size="small" 
                          sx={{ mt: 0.5, color: '#FFC107' }} 
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box sx={{ 
        py: 12, 
        background: 'linear-gradient(135deg, #147EFF 0%, #0E5FD9 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            backgroundImage: `url(${GetStarted})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.65
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
                Ready to transform your <Box component="span" sx={{ color: '#A5D6FF' }}>healthcare</Box> experience?
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 400, opacity: 0.9 }}>
                Join thousands of healthcare providers using TeleVitality today.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button
                variant="contained"
                size="large"
                onClick={onGetStartedClick}
                sx={{
                  bgcolor: 'white',
                  color: '#147EFF',
                  fontSize: '1rem',
                  fontWeight: 600,
                  py: 1.5,
                  px: 5,
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                Get Started Now
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box sx={{ bgcolor: '#0F172A', color: 'white', pt: 8, pb: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={3}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                TeleVitality
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
                The leading telehealth platform for modern healthcare providers.
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton 
                  aria-label="Facebook"
                  sx={{ 
                    color: 'white', 
                    opacity: 0.7, 
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      opacity: 1,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    } 
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton 
                  aria-label="Twitter"
                  sx={{ 
                    color: 'white', 
                    opacity: 0.7, 
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      opacity: 1,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    } 
                  }}
                >
                  <Twitter />
                </IconButton>
                <IconButton 
                  aria-label="Instagram"
                  sx={{ 
                    color: 'white', 
                    opacity: 0.7, 
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      opacity: 1,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    } 
                  }}
                >
                  <Instagram />
                </IconButton>
                <IconButton 
                  aria-label="LinkedIn"
                  sx={{ 
                    color: 'white', 
                    opacity: 0.7, 
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      opacity: 1,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    } 
                  }}
                >
                  <LinkedIn />
                </IconButton>
              </Stack>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Platform
              </Typography>
              <List dense>
                {['For Providers', 'For Clinics', 'For Patients', 'Pricing'].map((item) => (
                  <ListItem key={item} sx={{ px: 0, py: 0.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.8, 
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          opacity: 1,
                          color: '#147EFF',
                          transform: 'translateX(4px)'
                        } 
                      }}
                    >
                      {item}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Company
              </Typography>
              <List dense>
                {['About us', 'Careers', 'Research', 'Newsroom', 'Contact', 'Privacy & Security'].map((item) => (
                  <ListItem key={item} sx={{ px: 0, py: 0.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.8, 
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          opacity: 1,
                          color: '#147EFF',
                          transform: 'translateX(4px)'
                        } 
                      }}
                    >
                      {item}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Resources
              </Typography>
              <List dense>
                {['Telehealth Success', 'Blog', 'Podcast', 'Support'].map((item) => (
                  <ListItem key={item} sx={{ px: 0, py: 0.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.8, 
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          opacity: 1,
                          color: '#147EFF',
                          transform: 'translateX(4px)'
                        } 
                      }}
                    >
                      {item}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Stay Updated
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                Subscribe to our newsletter for the latest updates.
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Your email address"
                fullWidth
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { 
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px'
                    },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' }
                  }
                }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: '#147EFF',
                  color: 'white',
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#0E5FD9',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Subscribe
              </Button>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 2
          }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2025 TeleVitality. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.7,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    opacity: 1,
                    color: '#147EFF'
                  }
                }}
              >
                Privacy Policy
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.7,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    opacity: 1,
                    color: '#147EFF'
                  }
                }}
              >
                Terms of Service
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.7,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    opacity: 1,
                    color: '#147EFF'
                  }
                }}
              >
                HIPAA Compliance
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}