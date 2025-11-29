import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'react-router';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';

const passwordSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface UserData {
  email: string;
  userName: string;
}

const ActiveProvider: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const rawToken = searchParams.get('token');
  const token = rawToken ? decodeURIComponent(rawToken) : null;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      name: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing token');
      setLoading(false);
      return;
    }

    // Fetch user data using the token
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/active-provider`, {
          params: { token }
        });
        
        setUserData({
          email: response.data.email,
          userName: response.data.userName,
        });
        // Auto-fill the name field with userName from API response
        setValue('name', response.data.userName);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to verify token');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const onSubmit = async (data: PasswordFormData) => {
    if (!token) {
      setError('Token is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await axios.patch(`${API_BASE_URL}/active-provider`, 
        {
          password: data.password,
        },
        {
          params: { token }
        }
      );

      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to set password');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#ff6b35' }} />
      </Box>
    );
  }

  if (error && !userData) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          p: 2,
        }}
      >
        <Container maxWidth="sm">
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" color="error" gutterBottom>
                Invalid Link
              </Typography>
              <Typography color="text.secondary">
                {error}
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          p: 2,
        }}
      >
        <Container maxWidth="sm">
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" color="success.main" gutterBottom>
                Password Set Successfully!
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Your account has been activated. You can now log in to the system.
              </Typography>
              <Button
                variant="contained"
                href="/admin"
                sx={{
                  backgroundColor: '#ff6b35',
                  '&:hover': { backgroundColor: '#e55a2b' },
                }}
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={10}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CardContent sx={{ p: 6 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <PersonIcon sx={{ fontSize: 60, color: '#ff6b35', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                Set Your Password
              </Typography>
              {userData && (
                <Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    Welcome, {userData.userName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userData.email}
                  </Typography>
                </Box>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Name Field */}
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Full Name"
                    disabled={true}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#ff6b35' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {/* Password Field */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#ff6b35' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {/* Confirm Password Field */}
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    sx={{
                      mb: 4,
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#ff6b35' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={submitting}
                sx={{
                  height: 56,
                  borderRadius: 2,
                  backgroundColor: '#ff6b35',
                  '&:hover': { backgroundColor: '#e55a2b' },
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                }}
              >
                {submitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Set Password & Activate Account'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ActiveProvider;