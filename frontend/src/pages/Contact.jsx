import { Button, TextField, Box, Typography, Grid, Paper, Stack, Divider } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Phone, Email, LocationOn, Warning, Send } from '@mui/icons-material';

// Validation Schema
const contactSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  subject: Yup.string().required('Required'),
  message: Yup.string().required('Required').min(20, 'Minimum 20 characters')
});

export default function ContactPage() {
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
          '&:after': {
            content: '""',
            display: 'block',
            width: '80px',
            height: '4px',
            backgroundColor: 'secondary.main',
            margin: '20px auto 0'
          }
        }}
      >
        Contact TeleVitality Connect
      </Typography>

      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ 
            p: 4, 
            borderRadius: 3,
            background: 'white',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <Formik
              initialValues={{ name: '', email: '', subject: '', message: '' }}
              validationSchema={contactSchema}
              onSubmit={(values) => {
                console.log(values); // Replace with actual submission logic
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
                    variant="outlined"
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    sx={{ mb: 3 }}
                  />

                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ mb: 3 }}
                  />

                  <Field
                    as={TextField}
                    name="subject"
                    label="Subject"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={touched.subject && !!errors.subject}
                    helperText={touched.subject && errors.subject}
                    sx={{ mb: 3 }}
                  />

                  <Field
                    as={TextField}
                    name="message"
                    label="Your Message"
                    multiline
                    rows={6}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={touched.message && !!errors.message}
                    helperText={touched.message && errors.message}
                    sx={{ mb: 3 }}
                  />

                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large"
                    startIcon={<Send />}
                    sx={{ 
                      mt: 2,
                      px: 5,
                      borderRadius: '50px',
                      fontWeight: 'bold',
                      '&:hover': {
                        transform: 'translateY(-2px)',
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

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ 
            p: 4, 
            height: '100%',
            borderRadius: 3,
            background: 'white',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                mb: 4,
                color: 'primary.main'
              }}
            >
              Reach Us Directly
            </Typography>

            <Stack spacing={4}>
              {/* Emergency Alert */}
              <Paper sx={{ 
                p: 3, 
                bgcolor: '#fff3e0',
                borderRadius: 2,
                borderLeft: '4px solid',
                borderColor: 'warning.main'
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Warning color="warning" sx={{ fontSize: '2rem' }} />
                  <Box>
                    <Typography variant="subtitle1" color="error">
                      For Medical Emergencies
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Call: 911 or 1-800-HELP-NOW
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Contact Details */}
              <Stack spacing={3}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Phone color="primary" sx={{ fontSize: '2rem' }} />
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      General Inquiries
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      +1 (352) 123-4567
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={3} alignItems="center">
                  <Email color="primary" sx={{ fontSize: '2rem' }} />
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      support@televitality.com
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={3} alignItems="center">
                  <LocationOn color="primary" sx={{ fontSize: '2rem' }} />
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

              {/* Map Embed */}
              <Box sx={{ 
                height: 250, 
                bgcolor: '#f5f5f5', 
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative'
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
      
      {/* Footer */}
      <Paper 
        component="footer" 
        elevation={4} 
        sx={{ 
          mt: 8,
          p: 4,
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
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