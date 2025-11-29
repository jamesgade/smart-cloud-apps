import {
    Box,
    Button,
    Divider,
    InputAdornment,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
    IconButton,
    Select,
    MenuItem,
    Link
} from "@mui/material";
import { useLogin } from "@refinedev/core";
import CampusYatraEducationLogo from '../logos/campusyatra';
import { useForm, Controller } from "react-hook-form";
import { FieldValues } from "react-hook-form";
import { HttpError } from '@refinedev/core';
import axios from 'axios';
import axiosInstance from '../../libs/axiosInstance';
import LockOutlined from '@mui/icons-material/LockOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { useState, useMemo, useEffect } from "react";
import { customStyles } from "../../theme/customStyles";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { API_BASE_URL } from "../../libs/constants";
import { countryCodes } from "../../constants/countryCodes";
import { useNavigate } from "react-router";

const PhoneSchema = z.object({
    phone: z.string()
        .nonempty("Phone number is required")
        .regex(/^[0-9]{6,15}$/, "Please enter a valid phone number"),
    otp: z.string().optional(),
});

const OTPSchema = z.object({
    phone: z.string().optional(),
    otp: z.string()
        .nonempty("OTP is required")
        .length(6, "OTP must be 6 digits"),
});

type LoginFormType = {
    phone?: string;
    otp?: string;
};

const LoginForm = () => {
    const { mutate: login } = useLogin();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { switchToRegister, closeLogin } = useAuthModal();
    const navigate = useNavigate();
    const [otpSent, setOtpSent] = useState(false);
    const [isRequestingOtp, setIsRequestingOtp] = useState(false);
    const [otpError, setOtpError] = useState<string | null>(null);
    const [countryCode, setCountryCode] = useState('+91'); // Default to India
    const [resendTimer, setResendTimer] = useState(0);
    const [isResending, setIsResending] = useState(false);

    // Dynamic schema based on current step
    const currentSchema = useMemo(() => otpSent ? OTPSchema : PhoneSchema, [otpSent]);
    
    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        reset,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormType, HttpError>({
        resolver: zodResolver(currentSchema),
        mode: 'onChange'
    });

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

    const getPhoneValue = () => getValues('phone') || '';
    const handleSendOtp = async () => {
        const phoneValue = getPhoneValue();
        const phoneRegex = /^[0-9]{6,15}$/;
        if (!phoneValue || !phoneRegex.test(phoneValue)) {
            return;
        }

        setIsRequestingOtp(true);
        setOtpError(null); // Clear any previous errors

        try {
            // Direct API call for OTP request (not using authProvider to avoid premature auth)
            const fullPhoneNumber = `${phoneValue}`;
            const response = await axios.post(`${API_BASE_URL}/auth/signin-student`, {
                mobilePhone: fullPhoneNumber
            });

            setOtpSent(true);
            setIsRequestingOtp(false);
            // Use epoch from API response to calculate timer
            startResendTimer(response.data?.epoch);
        } catch (error: any) {
            console.error('Failed to send OTP:', error);
            setIsRequestingOtp(false);

            // Handle different error scenarios
            if (error.response?.status === 404) {
                setOtpError('Phone number not registered. Please create an account first.');
            } else if (error.response?.status === 400) {
                setOtpError('Invalid phone number format. Please check and try again.');
            } else if (error.response?.data?.message) {
                setOtpError(error.response.data.message);
            } else {
                setOtpError('Failed to send OTP. Please try again or contact support.');
            }
        }
    };

    const handleResendOtp = async () => {
        const phoneValue = getPhoneValue();
        if (!phoneValue) return;

        setIsResending(true);
        setOtpError(null);

        try {
            const fullPhoneNumber = `${phoneValue}`;
            const response = await axiosInstance.post(`${API_BASE_URL}/auth/resend-otp-student-login`, {
                mobilePhone: fullPhoneNumber
            });

            // Use epoch from API response to calculate timer
            startResendTimer(response.data?.epoch);
            // Optionally show success message
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

    const handleFormSubmit = async (values: FieldValues) => {
        // Only proceed with login if OTP has been sent
        if (!otpSent) {
            return; // Do nothing if OTP hasn't been sent yet
        }

        // Validate OTP manually
        if (!values.otp || values.otp.length !== 6) {
            return; // Let the field validation handle this
        }

        // Use authProvider for final login with OTP
        // Use the phone value from form
        const fullPhoneNumber = getPhoneValue();
        login({
            loginType: 'student',
            phone: fullPhoneNumber,
            otp: values.otp
        }, {
            onSuccess: () => {
                // Close login modal on success
                closeLogin();
                // AuthProvider handles redirect to dashboard automatically
            },
            onError: (error) => {
                console.error('Login failed:', error);
                // Handle error appropriately - could show error message to user
            }
        });
    }

    return (
        <Box sx={{
            backgroundColor: 'primary.50',
            padding: isMobile ? '2rem' : '4rem',
            borderRadius: '1.5rem',
            maxWidth: '500px',
            position: 'relative',
        }}>
            <IconButton
                onClick={closeLogin}
                sx={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    color:'#333',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <CampusYatraEducationLogo />
            </Box>
            <Typography variant="h6" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                Login
            </Typography>
            <Divider sx={{
                marginBottom: '1rem',
                borderColor: 'primary.400',
            }} />
            <Box component='form' onSubmit={handleSubmit(handleFormSubmit)} autoComplete="off">
                <Box>
                    <Box component="label" htmlFor="phone">
                        Phone Number
                    </Box>
                    <Box>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    error={!!errors.phone}
                                    placeholder="Enter phone number"
                                    variant="outlined"
                                    disabled={otpSent}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setOtpError(null); // Clear error when user types
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
                                        marginBottom: (errors?.phone?.message || otpError) ? 0 : "1rem",
                                    }}
                                />
                            )}
                        />
                    </Box>
                    {(errors?.phone || otpError) && <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: '1rem',
                        }}
                    >
                        <WarningAmberIcon color="error" sx={{ marginRight: 0.5, fontSize: '14px' }} />
                        <Typography color="error" variant="caption">
                            {errors.phone?.message || otpError}
                        </Typography>
                    </Box>}
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
                                            marginBottom: errors?.otp?.message ? 0 : "1rem",
                                        }}
                                    />
                                )}
                            />
                            {errors?.otp && <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: '1rem',
                                }}
                            >
                                <WarningAmberIcon color="error" sx={{ marginRight: 0.5, fontSize: '14px' }} />
                                {errors.otp && <Typography color="error" variant="caption">
                                    {errors?.otp?.message as string}
                                </Typography>}
                            </Box>}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <Typography
                                onClick={() => {
                                    setOtpSent(false);
                                    setOtpError(null); // Clear error when changing phone number
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
                        disabled={!getPhoneValue() || !!errors.phone || isRequestingOtp}
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
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </Button>
                )}
                <Typography
                    sx={{
                        marginTop: '1rem',
                        textAlign: 'center',
                    }}
                >
                    Don't have an account? <span style={customStyles.auth.clickableText} onClick={switchToRegister}>Create Account</span>
                </Typography>
                <Typography
                    sx={{
                        marginTop: '1rem',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        color: '#666'
                    }}
                >
                    By logging in, you agree to our{' '}
                    <Link
                        href="/terms-and-conditions"
                        rel="noopener noreferrer"
                        sx={{
                            color: '#FF6B35',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        Terms & Conditions
                    </Link>
                </Typography>
                {/* <Typography
                    sx={{
                        marginTop: '0.5rem',
                        textAlign: 'center',
                    }}
                >
                    <a
                        href="/forgot-password"
                        style={{
                            ...customStyles.auth.clickableText,
                            textDecoration: 'none'
                        }}
                        onClick={(e) => {
                            // e.preventDefault();
                            // closeLogin();
                            window.location.href = '/forgot-password';
                        }}
                    >
                        Forgot your password?
                    </a>
                </Typography> */}
            </Box>
        </Box>
    );
};

export default LoginForm;