import React, { useState } from 'react';
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
  Avatar,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoginFormData,
  LoginSchema,
  checkPasswordRequirements,
} from '@smart-cloud-apps/common-dto';
import {
  HttpError,
  useGetIdentity,
  useLogin,
  useNavigation,
  useNotification,
} from '@refinedev/core';
// import AdminHeader from '../../components/AdminHeader';
import icon from '../../../../public/images/campus_yatra_logo.png';
// Use public assets instead of direct imports to avoid circular dependencies

const AdminLogin = () => {
  const { mutate: login, isLoading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const passwordValue = watch('password');
  const passwordRequirements = passwordValue
    ? checkPasswordRequirements(passwordValue)
    : null;
  const onSubmit = async (data: any) => {
    // Handle login logic here
    await login({
      email: data.email,
      password: data.password,
      path:'/'
    });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //     useMemo(() => {
  //     if (userData) {
  //       push('/dashboard');
  //     }
  //   }, [userData]);

  //   <SignInButton
  //   type="primary"
  //   htmlType="submit"
  //   disabled={timer === 0 && loginres && loginres?.isMfa}
  // >
  //   <IntlMessages id="common.login" />
  // </SignInButton>

  // const loginWithEmailAndPassword = async () => {
  //     const user={

  //     }
  //     const { data } = await axios.post(`${baseurl}/auth/signin`, user);
  //     await login({
  //       username: ,
  //       remember: ,
  //     })

  // }

  return (
    <>
      {/* <AdminHeader /> */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #FFE0B2 0%, #FFCC80 50%, #FFB74D 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
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
          <CardContent sx={{ padding: 6 }}>
            {/* Campus Yatra Logo */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <img
                src={icon}
                alt="Campus Yatra Logo"
                style={{
                  height: '60px',
                  // width: '60px',
                  // objectFit: 'contain',
                  marginBottom: '16px'
                }}
              />
              <Typography
                variant="h5"
                align="center"
                color="#000"
                sx={{ 
                  fontWeight: 500,
                  fontSize: '1.5rem'
                }}
              >
                Login here
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#FF6B35' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        color: 'black',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: '#ccc',
                        },
                        '&:hover fieldset': {
                          borderColor: '#FF6B35',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FF6B35',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#FF6B35',
                        '&.Mui-focused': {
                          color: '#FF6B35',
                        },
                      },
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
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#FF6B35' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff style={{ color: '#FF6B35' }} />
                              ) : (
                                <Visibility style={{ color: '#FF6B35' }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        color: 'black',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: '#ccc',
                        },
                        '&:hover fieldset': {
                          borderColor: '#FF6B35',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FF6B35',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#FF6B35',
                        '&.Mui-focused': {
                          color: '#FF6B35',
                        },
                      },
                    }}
                  />
                )}
              />

              {/* Password Requirements */}
              {/* {passwordValue && passwordRequirements && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="#000" sx={{ mb: 1, display: 'block' }}>
                    Password Requirements:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: passwordRequirements.minLength ? 'success.main' : 'error.main',
                      }}
                    >
                      • At least 8 characters
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: passwordRequirements.hasUppercase ? 'success.main' : 'error.main',
                      }}
                    >
                      • One uppercase letter
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: passwordRequirements.hasLowercase ? 'success.main' : 'error.main',
                      }}
                    >
                      • One lowercase letter
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: passwordRequirements.hasNumber ? 'success.main' : 'error.main',
                      }}
                    >
                      • One number
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: passwordRequirements.hasSpecialChar ? 'success.main' : 'error.main',
                      }}
                    >
                      • One special character (@$!%*?&)
                    </Typography>
                  </Box>
                </Box>
              )} */}

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={!isValid || !isDirty}
                sx={{
                  mt: 2,
                  mb: 2,
                  height: 56,
                  borderRadius: 2,
                  background:
                    'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
                  },
                  '&:disabled': {
                    background: '#ccc',
                  },
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                }}
              >
                Sign In
              </Button>

              {/* Forgot Password Link */}
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#FF6B35',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={(e) => {
                            // e.preventDefault();
                            // closeLogin();
                            window.location.href = '/forgot-password';
                        }}
                >
                  Forgot your password?
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
      </Box>
    </>
  );
};

export default AdminLogin;
