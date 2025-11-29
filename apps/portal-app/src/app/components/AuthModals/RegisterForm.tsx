import {
  Box,
  Button,
  Divider,
  InputAdornment,
  TextField,
  Typography,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Chip,
  Checkbox,
  FormControlLabel,
  Link
} from "@mui/material";
import CampusYatraEducationLogo from '../logos/campusyatra';
import { useForm, Controller } from "react-hook-form";
import { FieldValues } from "react-hook-form";
import { HttpError, useLogin } from '@refinedev/core';
import LockOutlined from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import axiosInstance from "../../libs/axiosInstance";
import { customStyles } from "../../theme/customStyles";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { API_BASE_URL } from "../../libs/constants";
import { countryCodes } from "../../constants/countryCodes";

const RegisterInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().refine((val) => {
    if (!val || val.trim() === '') return true;
    return z.string().email().safeParse(val).success;
  }, {
    message: "Please enter a valid email address"
  }).optional(),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{6,15}$/, "Please enter a valid phone number"),
  courseId: z.string().min(1, "Course selection is required."),
  state: z.string().min(1, "State is required.").refine((val) => val !== "", "State is required."),
  city: z.string().min(1, "City is required."),
  referralSource: z.string().min(1, "How did you know about us is required.").refine((val) => val !== "", "How did you know about us is required."),
  termsAccepted: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
  otp: z.string().optional(),
});

const RegisterOTPSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  courseId: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  referralSource: z.string().optional(),
  termsAccepted: z.boolean().optional(),
  otp: z.string()
    .min(1, "OTP is required")
    .length(6, "OTP must be 6 digits"),
});

type RegisterFormType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  courseId?: string;
  state?: string;
  city?: string;
  referralSource?: string;
  termsAccepted?: boolean;
  otp?: string;
};

interface Course {
  course_id: string;
  name: string;
  description: string;
  status: boolean;
}

const RegisterForm = () => {
  const { mutate: login } = useLogin();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { switchToLogin, closeRegister } = useAuthModal();
  const [otpSent, setOtpSent] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState('+91'); // Default to India
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Indian states list
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
  ];

  // Referral source options
  const referralSources = [
    'Google Search',
    'Facebook',
    'Instagram',
    'YouTube',
    'Friend/Family Referral',
    'Advertisement',
    'LinkedIn',
    'Twitter',
    'WhatsApp',
    'Seminars',
    'Workshops',
    'College Fair',
    'Education Expo',
    'Newspaper',
    'TV Advertisement',
    'Email Campaign',
  ];

  // Dynamic schema based on current step
  const currentSchema = useMemo(() => otpSent ? RegisterOTPSchema : RegisterInfoSchema, [otpSent]);
  
  const {
    control,
    handleSubmit,
    getValues,
    watch,
    trigger,
    clearErrors,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormType, HttpError>({
    resolver: zodResolver(currentSchema) as any,
    mode: 'onChange'
  });

  // Watch form values to trigger re-renders when they change
  const watchedValues = watch();

  // Clear errors when switching between steps
  useEffect(() => {
    clearErrors();
  }, [otpSent, clearErrors]);

  // Timer effect for resend countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Start timer when OTP is sent - calculate time from epoch
  const startResendTimer = (epochTime?: number) => {
    if (epochTime) {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeRemaining = epochTime - currentTime;
      // Set timer to time remaining until OTP expires (full 2 minutes)
      setResendTimer(Math.max(0, timeRemaining));
    } else {
      setResendTimer(120); // Default 2 minutes (120 seconds)
    }
  };

  const getFormValues = () => ({
    phone: watchedValues.phone || '',
    firstName: watchedValues.firstName || '',
    lastName: watchedValues.lastName || '',
    email: watchedValues.email || '',
    courseId: watchedValues.courseId || '',
    state: watchedValues.state || '',
    city: watchedValues.city || '',
    referralSource: watchedValues.referralSource || '',
  });

  // Check if form is valid for the current step
  const hasAllRequiredFields =
    (watchedValues?.firstName || '').trim() &&
    (watchedValues?.lastName || '').trim() &&
    (watchedValues?.phone || '').trim() &&
    watchedValues?.courseId &&
    watchedValues?.courseId !== '' &&
    watchedValues?.state &&
    watchedValues?.state !== '' &&
    (watchedValues?.city || '').trim() &&
    watchedValues?.referralSource &&
    watchedValues?.referralSource !== '' &&
    watchedValues?.termsAccepted === true;

  const hasNoErrors = !errors.firstName &&
    !errors.lastName &&
    !errors.email &&
    !errors.phone &&
    !errors.courseId &&
    !errors.state &&
    !errors.city &&
    !errors.referralSource &&
    !errors.termsAccepted;

  const isFormValid = !otpSent && hasAllRequiredFields && hasNoErrors;

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {

        const response = await axios.get(`${API_BASE_URL}/auth/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSendOtp = async () => {
    const formValues = getFormValues();
    const phoneRegex = /^[0-9]{6,15}$/;
    if (!formValues.phone || !phoneRegex.test(formValues.phone)) {
      return;
    }

    // Check if all required fields are filled
    if (!formValues.firstName || !formValues.lastName || !formValues.courseId || !formValues.state || !formValues.city || !formValues.referralSource) {
      return;
    }

    setIsRequestingOtp(true);
    setOtpError(null); // Clear any previous errors
    try {
      const fullPhoneNumber = `${formValues.phone}`;
      const payload = {
        mobilePhone: fullPhoneNumber,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        state: formValues.state,
        city: formValues.city,
        referralSource: formValues.referralSource,
        userTypeId: "2a5982f2-0dd0-496d-9b93-5a0ebf032130",
        studentAssignCourse: [
          {
            courseId: formValues.courseId,
            createdBy: fullPhoneNumber,
            updatedBy: fullPhoneNumber
          }
        ],
        studentAssignRoles: [
          {
            roleId: "85396e7c-1bf2-40cf-a03c-744fb6b9fa9f",
            createdBy: fullPhoneNumber,
            updatedBy: fullPhoneNumber
          }
        ]
      };

      const response = await axios.post(`${API_BASE_URL}/auth/signup-student`, payload);
      setOtpSent(true);
      // Use epoch from API response to calculate timer
      startResendTimer(response.data?.epoch);
    } catch (error: any) {
      console.error('Failed to send OTP:', error);
      
      // Handle different error scenarios
      if (error.response?.status === 409 || error.response?.status === 400) {
        setOtpError('Phone number already exists. Please use a different number or try logging in.');
      } else if (error.response?.status === 422) {
        setOtpError('Invalid data provided. Please check your information and try again.');
      } else if (error.response?.data?.message) {
        setOtpError(error.response.data.message);
      } else {
        setOtpError('Failed to send OTP. Please try again or contact support.');
      }
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    const formValues = getFormValues();
    if (!formValues.phone) return;

    setIsResending(true);
    setOtpError(null);

    try {
      const fullPhoneNumber = `${formValues.phone}`;
      const response = await axiosInstance.post(`${API_BASE_URL}/auth/resend-otp-student-register`, {
        mobilePhone: fullPhoneNumber
      });

      // Use epoch from API response to calculate timer
      startResendTimer(response.data?.epoch);
    } catch (error: any) {
      console.error('Failed to resend OTP:', error);
      
      if (error.response?.status === 429) {
        setOtpError('Please wait before requesting another OTP.');
      } else if (error.response?.data?.message) {
        setOtpError(error.response.data.message);
      } else {
        setOtpError('Failed to resend OTP. Please try again.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleSignUp = async (values: FieldValues) => {
    // Only proceed if OTP has been sent
    if (!otpSent) {
      return;
    }

    setSignupError(null); // Clear any previous errors
    try {
      const formValues = getFormValues();
      const fullPhoneNumber = `${formValues.phone}`;
      const payload = {
        mobilePhone: fullPhoneNumber,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        state: formValues.state,
        city: formValues.city,
        referralSource: formValues.referralSource,
        otp: values.otp,
        userTypeId: "2a5982f2-0dd0-496d-9b93-5a0ebf032130",
        studentAssignCourse: [
          {
            courseId: formValues.courseId,
            createdBy: fullPhoneNumber,
            updatedBy: fullPhoneNumber
          }
        ],
        studentAssignRoles: [
          {
            roleId: "85396e7c-1bf2-40cf-a03c-744fb6b9fa9f",
            createdBy: fullPhoneNumber,
            updatedBy: fullPhoneNumber
          }
        ]
      };

      const response = await axios.post(`${API_BASE_URL}/auth/signup-student`, payload);

      // After successful registration, use authProvider login to handle token storage and redirect
      login({
        loginType: 'student',
        phone: fullPhoneNumber,
        otp: values.otp
      }, {
        onSuccess: () => {
          closeRegister();
          // authProvider automatically handles redirect to dashboard
        },
        onError: (error) => {
          console.error('Login after registration failed:', error);
          // Fallback: store tokens manually and redirect
          if (response.data.accessToken) {
            localStorage.setItem('ACCESS_TOKEN_KEY', response.data.accessToken);
          }
          if (response.data.refreshToken) {
            localStorage.setItem('REFRESH_TOKEN', response.data.refreshToken);
          }
          if (response.data.identifier) {
            localStorage.setItem('IDENTIFIER', response.data.identifier);
          }
          closeRegister();
          window.location.href = '/dashboard';
        }
      });
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Handle different error scenarios
      if (error.response?.status === 409 || error.response?.status === 400) {
        setSignupError('Phone number already exists. Please use a different number or try logging in.');
      } else if (error.response?.status === 422) {
        setSignupError('Invalid OTP or data provided. Please check your information and try again.');
      } else if (error.response?.data?.message) {
        setSignupError(error.response.data.message);
      } else {
        setSignupError('Registration failed. Please try again or contact support.');
      }
    }
  }

  const features = [
    {
      icon: <SupportAgentIcon sx={{ fontSize: 24, color: '#FF6B35' }} />,
      title: 'Career Counselling'
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 24, color: '#FF6B35' }} />,
      title: 'Shortlist & Apply'
    },
    {
      icon: <AccountBalanceIcon sx={{ fontSize: 24, color: '#FF6B35' }} />,
      title: 'Scholarships'
    },
    {
      icon: <AttachMoneyIcon sx={{ fontSize: 24, color: '#FF6B35' }} />,
      title: 'Loans'
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 24, color: '#FF6B35' }} />,
      title: 'Application Deadlines'
    },
    {
      icon: <EventIcon sx={{ fontSize: 24, color: '#FF6B35' }} />,
      title: 'Daily Updates'
    },
  ];

  return (
    <Box sx={{
      backgroundColor: 'primary.50',
      padding: isMobile ? '1rem' : '2rem',
      borderRadius: '1.5rem',
      maxWidth: isMobile ? '500px' : '900px',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
    }}>
      <IconButton
        onClick={closeRegister}
        sx={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          color: '#333',
          zIndex: 1,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          }
        }}
      >
        <CloseIcon />
      </IconButton>
      
      {/* Logo at the top */}
      <Box sx={{ 
        position: 'absolute', 
        top: '1.5rem', 
        left: '50%', 
        transform: 'translateX(-50%)',
        zIndex: 1
      }}>
        <CampusYatraEducationLogo />
      </Box>

      {/* Left side - Features */}
      <Box sx={{ 
        flex: 1, 
        padding: isMobile ? '7rem 1rem 0.5rem' : '7rem 2rem 0.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        order: { xs: 2, sm: 1 }
      }}>
        <Typography variant="h6" sx={{ 
          marginBottom: '1rem', 
          marginTop: '0',
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#333',
          fontSize: '1rem'
        }}>
          Why Choose Campus Yatra?
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
          gap: 1.5 
        }}>
          {features.map((feature, index) => (
            <Card key={index} sx={{ 
              height: '100%',
              border: '1px solid #e0e0e0',
              borderRadius: 1.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderColor: '#FF6B35'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', padding: '0.75rem 0.5rem' }}>
                <Box sx={{ marginBottom: '0.25rem' }}>
                  {feature.icon}
                </Box>
                <Typography variant="body2" sx={{ 
                  fontWeight: '600',
                  fontSize: '0.75rem'
                }}>
                  {feature.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ 
          marginTop: '1rem', 
          textAlign: 'center',
          padding: '0.75rem',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          borderRadius: 2,
          border: '1px solid rgba(255, 107, 53, 0.2)'
        }}>
          <Typography variant="body2" sx={{ 
            fontWeight: 'bold',
            color: '#FF6B35',
            marginBottom: '0.25rem',
            fontSize: '0.875rem'
          }}>
            Join 10,000+ Students
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#666',
            fontSize: '0.75rem'
          }}>
            Start your educational journey with us today
          </Typography>
        </Box>
        
        <Typography
          sx={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem'
          }}>Already a user? <span style={customStyles.auth.clickableText} onClick={switchToLogin}>Sign in</span></Typography>
      </Box>

      {/* Divider */}
      <Divider 
        orientation={isMobile ? "horizontal" : "vertical"} 
        flexItem 
        sx={{ 
          margin: isMobile ? '1rem 0' : '12rem 1rem 0 1rem',
          borderColor: 'primary.300',
          order: { xs: 3, sm: 2 }
        }} 
      />

      {/* Right side - Register Form */}
      <Box sx={{ 
        flex: 1, 
        padding: isMobile ? '7rem 1rem 0.5rem' : '7rem 1rem 0.5rem 2rem',
        minWidth: isMobile ? '100%' : '400px',
        order: { xs: 1, sm: 3 }
      }}>
        <Typography variant="h6" sx={{ 
          marginBottom: '1rem', 
          marginTop: '0',
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#333',
          fontSize: '1rem'
        }}>
          Create Your Account
        </Typography>
        <Box component='form' onSubmit={handleSubmit(handleSignUp)} autoComplete="off">

        <Box sx={{ display: 'grid', gap: 0.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <Box>
            <Box component="label" htmlFor="firstName">
              First Name <span style={{ color: '#d32f2f' }}>*</span>
            </Box>
            <Box>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.firstName}
                    placeholder="Enter first name"
                    variant="outlined"
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">
                          <PersonIcon sx={{ fill: 'gray' }} />
                        </InputAdornment>,
                      }
                    }}
                    sx={{
                      ...customStyles.auth.input,
                      marginBottom: errors?.firstName?.message ? 0 : "0.5rem",
                    }}
                  />
                )}
              />
            </Box>
            {errors?.firstName && <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: '0.5rem',
              }}
            >
              <WarningAmberIcon color="error" sx={{ marginRight: 0.5, fontSize: '14px' }} />
              {errors.firstName && <Typography color="error" variant="caption">
                {errors.firstName.message as string}
              </Typography>}
            </Box>}
          </Box>

          <Box>
            <Box component="label" htmlFor="lastName">
              Last Name <span style={{ color: '#d32f2f' }}>*</span>
            </Box>
            <Box>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.lastName}
                    placeholder="Enter last name"
                    variant="outlined"
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">
                          <PersonIcon sx={{ fill: 'gray' }} />
                        </InputAdornment>,
                      }
                    }}
                    sx={{
                      ...customStyles.auth.input,
                      marginBottom: errors?.lastName?.message ? 0 : "0.5rem",
                    }}
                  />
                )}
              />
              {errors?.lastName && <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: '0.5rem',
                }}
              >
                <WarningAmberIcon color="error" sx={{ marginRight: 0.5, fontSize: '14px' }} />
                {errors.lastName && <Typography color="error" variant="caption">
                  {errors?.lastName?.message as string}
                </Typography>}
              </Box>}
            </Box>
          </Box>
        </Box>

        <Box>
          <Box component="label" htmlFor="email">
            Email Address
          </Box>
          <Box>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.email}
                  placeholder="Enter email address"
                  variant="outlined"
                  type="email"
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">
                        <PersonIcon sx={{ fill: 'gray' }} />
                      </InputAdornment>,
                    }
                  }}
                  sx={{
                    ...customStyles.auth.input,
                    marginBottom: errors?.email?.message ? 0 : "0.5rem",
                  }}
                />
              )}
            />
          </Box>
          {errors?.email && <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: '1rem',
            }}
          >
            <WarningAmberIcon color="error" sx={{ marginRight: 0.5, fontSize: '14px' }} />
            {errors.email && <Typography color="error" variant="caption">
              {errors.email.message as string}
            </Typography>}
          </Box>}
        </Box>

        <Box>
          <Box component="label" htmlFor="phone">
            Phone Number <span style={{ color: '#d32f2f' }}>*</span>
          </Box>
          <Box>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.phone || !!otpError}
                  placeholder="Enter phone number"
                  variant="outlined"
                  disabled={otpSent}
                  onChange={(e) => {
                    field.onChange(e);
                    setOtpError(null); // Clear OTP error when user types
                    setSignupError(null); // Clear signup error when user types
                  }}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            disabled={otpSent}
                            variant="standard"
                            sx={{
                              '& .MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                paddingRight: '24px !important',
                                fontSize: '0.95rem',
                              },
                              '&:before': { display: 'none' },
                              '&:after': { display: 'none' },
                              '& .MuiSvgIcon-root': {
                                fontSize: '16px',
                              }
                            }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: 300,
                                  '& .MuiMenuItem-root': {
                                    fontSize: '0.9rem',
                                    gap: 1
                                  }
                                }
                              }
                            }}
                          >
                            {countryCodes.map((country) => (
                              <MenuItem key={country.country} value={country.code}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <span>{country.flag}</span>
                                  <span>{country.code}</span>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                          <Box sx={{ height: '24px', width: '1px', backgroundColor: '#ddd' }} />
                        </Box>
                      </InputAdornment>,
                    }
                  }}
                  sx={{
                    ...customStyles.auth.input,
                    marginBottom: (errors?.phone?.message || otpError) ? 0 : "0.5rem",
                  }}
                />
              )}
            />
          </Box>
          {(errors?.phone || otpError) && <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: '0.5rem',
            }}
          >
            <WarningAmberIcon color="error" sx={{ marginRight: 0.5, fontSize: '14px' }} />
            <Typography color="error" variant="caption">
              {errors.phone?.message || otpError}
            </Typography>
          </Box>}
        </Box>

        <Box>
          <Box component="label" htmlFor="courseId">
            Course Interest <span style={{ color: '#d32f2f' }}>*</span>
          </Box>
          <Box>
            <FormControl fullWidth error={!!errors.courseId}>
              <Controller
                name="courseId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    error={!!errors.courseId}
                    displayEmpty
                    disabled={loadingCourses}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger('courseId');
                    }}
                    sx={{
                      ...customStyles.auth.input,
                      marginBottom: errors?.courseId?.message ? 0 : "0.5rem",
                    }}
                  >
                    <MenuItem value="" disabled>
                      {loadingCourses ? 'Loading courses...' : 'Select your course of interest'}
                    </MenuItem>
                    {courses.map((course) => (
                      <MenuItem key={course.course_id} value={course.course_id}>
                        {course.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Box>
          {errors?.courseId && <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: '1rem',
            }}
          >
            <WarningAmberIcon color="error" sx={{ marginRight: 0.5, fontSize: '14px' }} />
            {errors.courseId && <Typography color="error" variant="caption">
              {errors.courseId.message as string}
            </Typography>}
          </Box>}
        </Box>

        <Box sx={{ display: 'grid', gap: 0.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <Box>
            <Box component="label" htmlFor="state">
              State <span style={{ color: '#d32f2f' }}>*</span>
            </Box>
            <Box>
              <FormControl fullWidth error={!!errors.state}>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      displayEmpty
                      disabled={otpSent}
                      onChange={(e) => {
                        field.onChange(e);
                        trigger('state');
                      }}
                      sx={{
                        ...customStyles.auth.input,
                        marginBottom: errors?.state?.message ? 0 : "0.5rem",
                      }}
                    >
                      <MenuItem value="">
                        Select state
                      </MenuItem>
                      {indianStates.map((state) => (
                        <MenuItem key={state} value={state}>
                          {state}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Box>
            {errors?.state && <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: '0.5rem',
              }}
            >
              <WarningAmberIcon color="error" sx={{ marginRight: 0.5, fontSize: '14px' }} />
              {errors.state && <Typography color="error" variant="caption">
                {errors.state.message as string}
              </Typography>}
            </Box>}
          </Box>

          <Box>
            <Box component="label" htmlFor="city">
              City <span style={{ color: '#d32f2f' }}>*</span>
            </Box>
            <Box>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.city}
                    placeholder="Enter city"
                    variant="outlined"
                    disabled={otpSent}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">
                          <PersonIcon sx={{ fill: 'gray' }} />
                        </InputAdornment>,
                      }
                    }}
                    sx={{
                      ...customStyles.auth.input,
                      marginBottom: errors?.city?.message ? 0 : "0.5rem",
                    }}
                  />
                )}
              />
              {errors?.city && <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: '0.5rem',
                }}
              >
                <WarningAmberIcon color="error" sx={{ marginRight: 0.5, fontSize: '14px' }} />
                {errors.city && <Typography color="error" variant="caption">
                  {errors.city.message as string}
                </Typography>}
              </Box>}
            </Box>
          </Box>
        </Box>

        <Box>
          <Box component="label" htmlFor="referralSource">
            How did you know about us? <span style={{ color: '#d32f2f' }}>*</span>
          </Box>
          <Box>
            <FormControl fullWidth error={!!errors.referralSource}>
              <Controller
                name="referralSource"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    displayEmpty
                    disabled={otpSent}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger('referralSource');
                    }}
                    renderValue={(selected) => {
                      if (!selected || selected === '') {
                        return <span style={{ color: '#999' }}>Select how you found us</span>;
                      }
                      return selected;
                    }}
                    sx={{
                      ...customStyles.auth.input,
                      marginBottom: errors?.referralSource?.message ? 0 : "0.5rem",
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select how you found us
                    </MenuItem>
                    {referralSources.map((source) => (
                      <MenuItem key={source} value={source}>
                        {source}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Box>
          {errors?.referralSource && <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: '0.5rem',
            }}
          >
            <WarningAmberIcon color="error" sx={{ marginRight: 0.5, fontSize: '14px' }} />
            {errors.referralSource && <Typography color="error" variant="caption">
              {errors.referralSource.message as string}
            </Typography>}
          </Box>}
        </Box>

        <Box sx={{ marginBottom: '1rem', marginTop: '1rem' }}>
          <Controller
            name="termsAccepted"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={otpSent}
                    sx={{
                      color: errors.termsAccepted ? '#d32f2f' : 'primary.main',
                      '&.Mui-checked': {
                        color: '#FF6B35',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    I agree to the{' '}
                    <Link
                      href="/terms-and-conditions"
                      // target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: '#FF6B35',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Terms & Privacy Policy
                    </Link>{' '}
                    and authorize Campus Yatra & partners to contact me via Email, SMS, WhatsApp, RCS, or Call (even if on DNC/NDNC) regarding Campus Yatra service.
                  </Typography>
                }
                sx={{
                  alignItems: 'flex-start',
                  marginLeft: 0,
                  '& .MuiFormControlLabel-label': {
                    marginTop: '9px',
                  },
                }}
              />
            )}
          />
          {errors?.termsAccepted && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: '0.5rem',
              }}
            >
              <WarningAmberIcon color="error" sx={{ marginRight: 0.5, fontSize: '14px' }} />
              <Typography color="error" variant="caption">
                {errors.termsAccepted.message as string}
              </Typography>
            </Box>
          )}
        </Box>

        {otpSent && (
          <Box>
            <Box component="label" htmlFor="otp">
              Enter OTP
            </Box>
            <Box>
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="text"
                    error={!!errors.otp}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">
                          <LockOutlined sx={{ fill: 'gray' }} />
                        </InputAdornment>,
                      },
                      htmlInput: {
                        maxLength: 6
                      }
                    }}
                    placeholder="Enter 6-digit OTP"
                    variant="outlined"
                    sx={{
                      ...customStyles.auth.input,
                      marginBottom: errors?.otp?.message ? 0 : "0.5rem",
                    }}
                  />
                )}
              />
              {errors?.otp && <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: '0.5rem',
                }}
              >
                <WarningAmberIcon color="error" sx={{ marginRight: 0.5, fontSize: '14px' }} />
                {errors.otp && <Typography color="error" variant="caption">
                  {errors?.otp?.message as string}
                </Typography>}
              </Box>}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <Typography
                onClick={() => {
                  setOtpSent(false);
                  setOtpError(null); // Clear OTP error when changing phone number
                  setSignupError(null); // Clear signup error when changing phone number
                  clearErrors(); // Clear form errors
                  setResendTimer(0); // Reset timer
                }}
                sx={{
                  cursor: 'pointer',
                  color: '#FF6B35',
                  fontSize: '0.875rem',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Change phone number?
              </Typography>
              
              {resendTimer > 0 ? (
                <Typography sx={{ fontSize: '0.875rem', color: '#666' }}>
                  Resend OTP in {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
                </Typography>
              ) : (
                <Typography
                  onClick={handleResendOtp}
                  sx={{
                    cursor: isResending ? 'not-allowed' : 'pointer',
                    color: isResending ? '#ccc' : '#FF6B35',
                    fontSize: '0.875rem',
                    opacity: isResending ? 0.6 : 1,
                    '&:hover': {
                      textDecoration: isResending ? 'none' : 'underline',
                    }
                  }}
                >
                  {isResending ? 'Resending...' : 'Resend OTP'}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {!otpSent ? (
          <Button
            type="button"
            onClick={handleSendOtp}
            disabled={!isFormValid || isRequestingOtp}
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 2,
              mb: 2,
              height: 56,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
              },
              '&:disabled': {
                background: '#ccc',
              },
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}
          >
            {isRequestingOtp ? 'Sending...' : 'Send OTP'}
          </Button>
        ) : (
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            sx={{
              mt: 2,
              mb: 2,
              height: 56,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
              },
              '&:disabled': {
                background: '#ccc',
              },
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </Button>
        )}

        {/* Signup Error Display */}
        {signupError && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            <WarningAmberIcon color="error" sx={{ marginRight: 0.5, fontSize: '14px' }} />
            <Typography color="error" variant="caption">
              {signupError}
            </Typography>
          </Box>
        )}

        </Box>
      </Box>
    </Box>
  );
};

export default RegisterForm;