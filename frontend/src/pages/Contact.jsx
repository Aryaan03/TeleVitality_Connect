import { Button, TextField, Box, Typography, Grid, Paper, Stack, Divider } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WarningIcon from '@mui/icons-material/Warning';

// Validation Schema
const contactSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  subject: Yup.string().required('Required'),
  message: Yup.string().required('Required').min(20, 'Minimum 20 characters')
});

export default function ContactPage() {
  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Contact TeleVitality Connect
      </Typography>

      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
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
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />

                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    margin="normal"
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />

                  <Field
                    as={TextField}
                    name="subject"
                    label="Subject"
                    fullWidth
                    margin="normal"
                    error={touched.subject && !!errors.subject}
                    helperText={touched.subject && errors.subject}
                  />

                  <Field
                    as={TextField}
                    name="message"
                    label="Your Message"
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                    error={touched.message && !!errors.message}
                    helperText={touched.message && errors.message}
                  />

                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large" 
                    sx={{ mt: 2 }}
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
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Reach Us Directly
            </Typography>

            <Stack spacing={3}>
              {/* Emergency Alert */}
              <Paper sx={{ p: 2, bgcolor: '#fff3e0' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <WarningIcon color="warning" />
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
              <Divider />
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <PhoneIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle1">General Inquiries</Typography>
                    <Typography variant="h6">+1 (352) 123-4567</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle1">Email</Typography>
                    <Typography variant="h6">support@televitality.com</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <LocationOnIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle1">Main Hospital</Typography>
                    <Typography variant="h6">
                      123 Reitz Union<br />
                      Gainesville, FL 32608
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              {/* Map Embed */}
              <Divider />
              <Box sx={{ height: 200, bgcolor: '#f5f5f5', mt: 2 }}>
                {/* Replace with actual map component */}
                <Typography align="center" sx={{ pt: 8 }}>
                  [Map Integration Here]
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 8 }} />

      <Paper 
        component="footer" 
        elevation={3} 
        sx={{ 
          mt: 'auto', 
          py: 3,
          backgroundColor: '#f5f5f5',
          borderRadius: 2
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Office Hours
          </Typography>
          <Typography variant="body1">
            Monday-Friday: 8:00 AM - 8:00 PM EST<br />
            Saturday: 9:00 AM - 5:00 PM EST<br />
            Sunday: Closed
          </Typography>
        </Box>
      </Paper>

    </Box>
  );
}