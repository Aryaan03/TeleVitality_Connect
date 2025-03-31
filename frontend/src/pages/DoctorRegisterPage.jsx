import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Modal, 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { AccountCircle, Email, Lock, Close, Security } from '@mui/icons-material';
import { useState } from 'react';
import { authService } from '../services/api';

export default function DoctorRegisterPage({ open, handleClose, openLogin }) {
  const [error, setError] = useState('');

  return (
    <Modal open={open} onClose={handleClose}>
      <Box 
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 450 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 4,
          outline: 'none'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          p: 2,
          position: 'absolute',
          right: 0,
          top: 0
        }}>
          <IconButton onClick={handleClose} size="small" id='close-modal-button' data-testid="close-modal-button">
            <Close sx={{ color: 'text.secondary' }} />
          </IconButton>
        </Box>

        <Box sx={{ px: 4, pb: 4, pt: 5 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              textAlign: 'center',
              color: 'primary.main',
              mb: 1,
              fontSize: '1.8rem'
            }}
          >
            Medical Professional Registration
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center',
              color: 'text.secondary',
              mb: 3
            }}
          >
            Register for clinical portal access
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: 2,
                borderLeft: '4px solid',
                borderColor: 'error.main',
                alignItems: 'center'
              }}
            >
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{ 
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
              consentTelemedicine: false
            }}
            validationSchema={Yup.object({
              username: Yup.string().required('Required'),
              email: Yup.string().email('Invalid email').required('Required'),
              password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Required'),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Required'),
              consentTelemedicine: Yup.boolean()
                .oneOf([true], 'You must agree to the terms and conditions')
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await authService.docregister({
                  username: values.username,
                  email: values.email,
                  password: values.password
                });
                handleClose();
                openLogin();
              } catch (err) {
                setError(err.message || 'Registration failed. Please try again.');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Field
                  as={TextField}
                  name="username"
                  label="Username"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': { borderWidth: 2 },
                    }
                  }}
                  error={touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
                />

                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': { borderWidth: 2 },
                    }
                  }}
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />

                <Field
                  as={TextField}
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': { borderWidth: 2 },
                    }
                  }}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />

                <Field
                  as={TextField}
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': { borderWidth: 2 },
                    }
                  }}
                  error={touched.confirmPassword && !!errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />

                <FormControlLabel
                  control={
                    <Field
                      as={Checkbox}
                      name="consentTelemedicine"
                      color="primary"
                      sx={{ 
                        color: 'primary.main',
                        '&.Mui-checked': { color: 'primary.main' }
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      I agree to the terms and conditions of telemedicine services
                    </Typography>
                  }
                  sx={{ mt: 0.5 }}
                />
                {touched.consentTelemedicine && errors.consentTelemedicine && (
                  <Typography variant="body2" color="error" sx={{ mt: 0.5, ml: 1 }}>
                    {errors.consentTelemedicine}
                  </Typography>
                )}

                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ 
                    mt: 2,
                    py: 1.2,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    letterSpacing: 0.5,
                    background: 'linear-gradient(45deg, #1976d2 30%, #4dabf5 90%)',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: 2
                    },
                    transition: 'all 0.2s ease'
                  }}
                  data-testid="submit-button"
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : 'Register'}
                </Button>

                <Divider sx={{ my: 2, color: 'text.secondary' }}>Secure Patient Portal</Divider>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 1,
                  mt: 0.5,
                  mb: 1.5
                }}>
                  <Security fontSize="small" sx={{ color: 'success.main' }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      textAlign: 'center'
                    }}
                  >
                    256-bit SSL encrypted connection
                  </Typography>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Modal>
  );
}