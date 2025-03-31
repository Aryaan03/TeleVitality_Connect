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
  Divider
} from '@mui/material';
import { AccountCircle, Lock, Close, Security } from '@mui/icons-material';
import { useState } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ open, handleClose }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
          <IconButton onClick={handleClose} size="small">
            <Close sx={{ color: 'text.secondary' }} />
          </IconButton>
        </Box>

        <Box sx={{ px: 4, pb: 4, pt: 6 }}>
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
            Welcome Back
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center',
              color: 'text.secondary',
              mb: 4
            }}
          >
            Access your personalized health portal
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
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
            initialValues={{ username: '', password: '' }}
            validationSchema={Yup.object({
              username: Yup.string().required('Required'),
              password: Yup.string().required('Required'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const response = await authService.login(values);
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', "patient");
                handleClose();
                navigate('/profile');
              } catch (err) {
                setError(err.message || 'Invalid credentials. Please try again.');
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
                      '&.Mui-focused fieldset': {
                        borderWidth: 2,
                      },
                    }
                  }}
                  error={touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
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
                      '&.Mui-focused fieldset': {
                        borderWidth: 2,
                      },
                    }
                  }}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />

                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ 
                    mt: 3,
                    py: 1.5,
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
                >
                  {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
                </Button>

                {/* Reduced spacing here */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 1  
                }}>
                  <Button 
                    variant="text" 
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline'
                      }
                    }}
                    onClick={() => navigate('/reset-password')}
                  >
                    Forgot Password?
                  </Button>
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    textAlign: 'center',
                    color: 'text.secondary',
                    mt: 2,  
                    fontSize: '0.9rem'
                  }}
                >
                  Don't have an account?{' '}
                  <Button 
                    variant="text" 
                    size="small"
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 600,
                      p: 0,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline'
                      }
                    }}
                    onClick={() => navigate('/register')}
                  >
                    Sign Up Now
                  </Button>
                </Typography>

                <Divider sx={{ my: 2, color: 'text.secondary' }}>Security</Divider> {/* Changed from my: 3 */}

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