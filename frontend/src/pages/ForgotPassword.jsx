import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Close, Email, Lock, VpnKey } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { authService } from '../services/api';

export default function ForgotPassword({ open, handleClose, openLogin, openDoctorLogin, userType }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const EmailSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
  });

  const OtpSchema = Yup.object({
    otp: Yup.string().length(6, 'Must be 6 digits').required('Required'),
    newPassword: Yup.string().min(6, 'Min 6 characters').required('Required'),
  });

  useEffect(() => {
    let interval;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleSendOTP = async (values) => {
    try {
      setLoading(true);
      await authService.forgotPassword({ email: values.email });
      setEmail(values.email);
      setStep(2);
      setResendTimer(60);
      setCanResend(false);
      setServerError('');
    } catch (err) {
      setServerError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (values) => {
    try {
      setLoading(true);
      const verifyResponse = await authService.verifyResetCode({
        email,
        code: values.otp
      });

      if (userType == 'patient') {
        await authService.resetPassword({
          reset_token: verifyResponse.reset_token,
          new_password: values.newPassword
        });
      } else {
        await authService.resetPasswordDoc({
          reset_token: verifyResponse.reset_token,
          new_password: values.newPassword
        });
      }

      setServerError('');
      handleClose();
      userType == 'patient' ? openLogin() : openDoctorLogin();
    } catch (err) {
      let errorMessage = 'Password reset failed';
      if (err.message) {
        try {
          const parsed = JSON.parse(err.message);
          errorMessage = parsed.error || err.message;
        } catch (e) {
          errorMessage = err.message;
        }
      }
      if (err.response?.status === 401) errorMessage = 'Invalid or expired code';
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
          borderRadius: 3,
          outline: 'none',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          p: 2
        }}>
          <IconButton 
            onClick={handleClose} 
            sx={{ 
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } 
            }}
          >
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ px: 4, pb: 4, pt: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              color: 'text.primary',
              mb: 1,
              fontSize: '1.5rem',
            }}
          >
            Forgot Password
          </Typography>
          <Typography
            variant="body2"
            sx={{ 
              textAlign: 'center', 
              color: 'text.secondary', 
              mb: 3,
              fontSize: '0.875rem'
            }}
          >
            We'll help you reset it securely.
          </Typography>

          {serverError && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                alignItems: 'center',
                py: 0.5
              }}
            >
              {serverError}
            </Alert>
          )}

          {step === 1 && (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={EmailSchema}
              onSubmit={handleSendOTP}
            >
              {({ errors, touched }) => (
                <Form>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email Address"
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
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&.Mui-focused fieldset': {
                          borderWidth: 1
                        }
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                      mt: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                        backgroundColor: 'primary.dark'
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'Send Verification Code'
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {step === 2 && (
            <Formik
              initialValues={{ otp: '', newPassword: '' }}
              validationSchema={OtpSchema}
              onSubmit={handleVerifyOTP}
            >
              {({ errors, touched }) => (
                <Form>
                  <Field
                    as={TextField}
                    name="otp"
                    label="Verification Code"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKey sx={{ color: 'action.active' }} />
                        </InputAdornment>
                      ),
                    }}
                    error={touched.otp && !!errors.otp}
                    helperText={touched.otp && errors.otp}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&.Mui-focused fieldset': {
                          borderWidth: 1
                        }
                      }
                    }}
                  />

                  <Field
                    as={TextField}
                    name="newPassword"
                    label="New Password"
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
                    error={touched.newPassword && !!errors.newPassword}
                    helperText={touched.newPassword && errors.newPassword}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&.Mui-focused fieldset': {
                          borderWidth: 1
                        }
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                      mt: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                        backgroundColor: 'primary.dark'
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'Reset Password'
                    )}
                  </Button>

                  <Box sx={{ 
                    mt: 2,
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1
                  }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {canResend ? (
                        'Didn\'t receive code?'
                      ) : (
                        `Resend code in ${resendTimer}s`
                      )}
                    </Typography>
                    {canResend && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => handleSendOTP({ email })}
                        sx={{
                          minWidth: 0,
                          padding: 0,
                          fontWeight: 600,
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Resend
                      </Button>
                    )}
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: 'center',
                      color: 'text.secondary',
                      mt: 2,
                      fontSize: '0.875rem'
                    }}
                  >
                    Check your email for the verification code
                  </Typography>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      </Box>
    </Modal>
  );
}