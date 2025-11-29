import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Email as EmailIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import { API_BASE_URL } from '../../libs/constants';
import axios from 'axios';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const otpPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmailFormData = z.infer<typeof emailSchema>;
type OtpPasswordFormData = z.infer<typeof otpPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [userEmail, setUserEmail] = useState('');

  // Form for email step
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  // Form for OTP and password step
  const otpForm = useForm<OtpPasswordFormData>({
    resolver: zodResolver(otpPasswordSchema),
    defaultValues: {
      email: '',
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmitEmail = async (data: EmailFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email: data.email
      });

      setMessage({
        type: 'success',
        text: response.data.message || 'OTP has been sent to your email address.',
      });
      
      setUserEmail(data.email);
      otpForm.setValue('email', data.email);
      setStep('otp');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to send OTP. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOtp = async (data: OtpPasswordFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password-otp`, {
        email: data.email,
        otp: data.otp,
        password: data.password,
        confirmPassword: data.confirmPassword
      });

      setMessage({
        type: 'success',
        text: response.data.message || 'Password has been successfully updated.',
      });
      
      // Navigate back to login after successful password reset
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/admin');
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 400 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Icon */}
            <Box
              sx={{
                backgroundColor: '#ff6b35',
                borderRadius: '50%',
                p: 2,
                mb: 2,
              }}
            >
              <EmailIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>

            {/* Title */}
            <Typography component="h1" variant="h4" gutterBottom>
              Forgot Password
            </Typography>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              {step === 'email' 
                ? 'Enter your email address to receive an OTP for password reset.' 
                : 'Enter the OTP sent to your email and set your new password.'}
            </Typography>

            {/* Alert Messages */}
            {message && (
              <Alert severity={message.type} sx={{ width: '100%', mb: 2 }}>
                {message.text}
              </Alert>
            )}

            {/* Form */}
            {step === 'email' ? (
              <Box component="form" onSubmit={emailForm.handleSubmit(onSubmitEmail)} sx={{ width: '100%' }}>
                <Controller
                  name="email"
                  control={emailForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      error={!!emailForm.formState.errors.email}
                      helperText={emailForm.formState.errors.email?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#ff6b35',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#ff6b35',
                        },
                      }}
                    />
                  )}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: '#ff6b35',
                    '&:hover': {
                      backgroundColor: '#e55a2b',
                    },
                    height: 48,
                  }}
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={otpForm.handleSubmit(onSubmitOtp)} sx={{ width: '100%' }}>
                <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                  OTP sent to: <strong>{userEmail}</strong>
                </Typography>

                <Controller
                  name="otp"
                  control={otpForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      required
                      fullWidth
                      id="otp"
                      label="Enter OTP"
                      name="otp"
                      autoFocus
                      inputProps={{ maxLength: 6 }}
                      error={!!otpForm.formState.errors.otp}
                      helperText={otpForm.formState.errors.otp?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#ff6b35',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#ff6b35',
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={otpForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="new-password"
                      error={!!otpForm.formState.errors.password}
                      helperText={otpForm.formState.errors.password?.message}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                sx={{ color: '#666' }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#ff6b35',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#ff6b35',
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={otpForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      autoComplete="new-password"
                      error={!!otpForm.formState.errors.confirmPassword}
                      helperText={otpForm.formState.errors.confirmPassword?.message}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                                sx={{ color: '#666' }}
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#ff6b35',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#ff6b35',
                        },
                      }}
                    />
                  )}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: '#ff6b35',
                    '&:hover': {
                      backgroundColor: '#e55a2b',
                    },
                    height: 48,
                  }}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => {
                    setStep('email');
                    setMessage(null);
                  }}
                  sx={{
                    mt: 1,
                    color: '#ff6b35',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.04)',
                    },
                  }}
                >
                  Back to Email
                </Button>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Remember your password?{' '}
            <Button
              variant="text"
              onClick={handleBackToLogin}
              sx={{
                color: '#ff6b35',
                textTransform: 'none',
                p: 0,
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Sign in here
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;