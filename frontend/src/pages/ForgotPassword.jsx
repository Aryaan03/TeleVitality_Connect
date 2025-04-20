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
import { useState } from 'react';
import { authService } from '../services/api'; // Make sure it includes forgotPassword and verifyOTP

export default function ForgotPassword({ open, handleClose, openLogin }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const EmailSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
  });

  const OtpSchema = Yup.object({
    otp: Yup.string().length(6, 'Must be 6 digits').required('Required'),
    newPassword: Yup.string().min(6, 'Min 6 characters').required('Required'),
  });

  const handleSendOTP = async (values) => {
    try {
      setLoading(true);
      await authService.forgotPassword({ email: values.email }); // Backend sends OTP via Twilio
      setEmail(values.email);
      setStep(2);
      setServerError('');
    } catch (err) {
      setServerError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

 // ForgotPassword.jsx
const handleVerifyOTP = async (values) => {
  try {
    setLoading(true);
    
    // First verify code and get reset token
    const verifyResponse = await authService.verifyResetCode({
      email,
      code: values.otp
    });

    // Then reset password using the token
    await authService.resetPassword({
      reset_token: verifyResponse.reset_token,
      new_password: values.newPassword
    });

    setServerError('');
    handleClose();
    openLogin();
  } catch (err) {
    const errorMessage = err.response?.status === 401 
      ? 'Invalid or expired code' 
      : err.message || 'Password reset failed';
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
          borderRadius: 4,
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <IconButton onClick={handleClose} size="small">
            <Close sx={{ color: 'text.secondary' }} />
          </IconButton>
        </Box>

        <Box sx={{ px: 4, pb: 4, pt: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              color: 'primary.main',
              mb: 1,
              fontSize: '1.6rem',
            }}
          >
            Forgot Password
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}
          >
            We'll help you reset it securely.
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
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
                      background: 'linear-gradient(45deg, #1976d2 30%, #4dabf5 90%)',
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'Send OTP'
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
                    label="Enter OTP"
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
                      background: 'linear-gradient(45deg, #1976d2 30%, #4dabf5 90%)',
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
