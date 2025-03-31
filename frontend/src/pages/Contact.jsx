import { Button, TextField, Box, Typography, Grid, Paper, Stack, Divider, useTheme } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Phone, Email, LocationOn, Warning, Send } from '@mui/icons-material';

// Validation Schema (unchanged)
const contactSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  subject: Yup.string().required('Required'),
  message: Yup.string().required('Required').min(20, 'Minimum 20 characters')
});

export default function ContactPage() {
  const theme = useTheme();

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      margin: 'auto', 
      p: 4,
      background: 'linear-gradient(45deg, #f8f9fa 0%, #e9ecef 100%)'
    }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          textAlign: 'center',
          mb: 6,
          position: 'relative',
          fontSize: { xs: '2rem', md: '3rem' },
          '&:after': {
            content: '""',
            display: 'block',
            width: '80px',
            height: '4px',
            backgroundColor: 'secondary.main',
            margin: '20px auto 0',
            borderRadius: '2px'
          }
        }}
      >
        Contact TeleVitality Connect
      </Typography>

      <Grid container spacing={4}>
        {/* Contact Form - Enhanced styling */}
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ 
            p: 4, 
            borderRadius: 4,
            background: 'white',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
            border: `1px solid ${theme.palette.divider}`
          }}>
            <Formik
              initialValues={{ name: '', email: '', subject: '', message: '' }}
              validationSchema={contactSchema}
              onSubmit={(values) => {
                console.log(values); // Original functionality maintained
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <Field
                    as={TextField}
                    name="name"
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    variant="filled"
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    sx={{ mb: 3 }}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
                        }
                      }
                    }}
                  />

                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    margin="normal"
                    variant="filled"
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ mb: 3 }}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
                        }
                      }
                    }}
                  />

                  <Field
                    as={TextField}
                    name="subject"
                    label="Subject"
                    fullWidth
                    margin="normal"
                    variant="filled"
                    error={touched.subject && !!errors.subject}
                    helperText={touched.subject && errors.subject}
                    sx={{ mb: 3 }}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
                        }
                      }
                    }}
                  />

                  <Field
                    as={TextField}
                    name="message"
                    label="Your Message"
                    multiline
                    rows={6}
                    fullWidth
                    margin="normal"
                    variant="filled"
                    error={touched.message && !!errors.message}
                    helperText={touched.message && errors.message}
                    sx={{ mb: 3 }}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
                        }
                      }
                    }}
                  />

                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large"
                    startIcon={<Send />}
                    sx={{ 
                      mt: 2,
                      px: 5,
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      transition: 'all 0.2s ease',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    Send Message
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>

        {/* Contact Information - Enhanced styling */}
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ 
            p: 4, 
            height: '100%',
            borderRadius: 4,
            background: 'white',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
            border: `1px solid ${theme.palette.divider}`
          }}>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                mb: 4,
                color: 'primary.main',
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              Reach Us Directly
            </Typography>

            <Stack spacing={4}>
              {/* Emergency Alert - Enhanced */}
              <Paper sx={{ 
                p: 3, 
                bgcolor: '#fff3e0',
                borderRadius: 3,
                borderLeft: `4px solid ${theme.palette.warning.main}`,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateX(4px)'
                }
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Warning color="warning" sx={{ fontSize: '2.2rem' }} />
                  <Box>
                    <Typography variant="subtitle1" color="error" sx={{ fontWeight: 600 }}>
                      For Medical Emergencies
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Call: 911 or 1-800-HELP-NOW
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Contact Details - Enhanced */}
              <Stack spacing={3}>
                <Stack direction="row" spacing={3} alignItems="center" sx={{ p: 2, borderRadius: 2, '&:hover': { backgroundColor: '#f8f9fa' } }}>
                  <Phone color="primary" sx={{ fontSize: '2.2rem' }} />
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      General Inquiries
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      +1 (352) 123-4567
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={3} alignItems="center" sx={{ p: 2, borderRadius: 2, '&:hover': { backgroundColor: '#f8f9fa' } }}>
                  <Email color="primary" sx={{ fontSize: '2.2rem' }} />
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      support@televitality.com
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={3} alignItems="center" sx={{ p: 2, borderRadius: 2, '&:hover': { backgroundColor: '#f8f9fa' } }}>
                  <LocationOn color="primary" sx={{ fontSize: '2.2rem' }} />
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      Main Hospital
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      123 Reitz Union<br />
                      Gainesville, FL 32608
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              {/* Map Embed - Enhanced */}
              <Box sx={{ 
                height: 250, 
                bgcolor: '#f5f5f5', 
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                border: `1px solid ${theme.palette.divider}`
              }}>
                <Typography align="center" sx={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'text.secondary'
                }}>
                  [Map Integration Here]
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Footer - Enhanced with increased top margin */}
      <Paper 
        component="footer" 
        elevation={6} 
        sx={{ 
          mt: 12, // Increased from 8 to 12 for more spacing
          p: 4,
          backgroundColor: 'white',
          borderRadius: 4,
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              color: 'primary.main'
            }}
          >
            Office Hours
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monday-Friday: 8:00 AM - 8:00 PM EST<br />
            Saturday: 9:00 AM - 5:00 PM EST<br />
            Sunday: Closed
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}