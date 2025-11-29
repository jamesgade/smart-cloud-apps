import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  FormHelperText,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';

const createStudentSchema = z.object({
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
  referralSource: z.string().min(1, "Referral source is required.").refine((val) => val !== "", "Referral source is required."),
});

type CreateStudentFormData = z.infer<typeof createStudentSchema>;

interface CreateStudentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Course {
  course_id: string;
  name: string;
  description: string;
  status: boolean;
}

const CreateStudentModal: React.FC<CreateStudentModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Indian states list
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
  ];

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
    'Email Campaign',
  ];

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      courseId: '',
      state: '',
      city: '',
      referralSource: '',
    },
  });

  useEffect(() => {
    if (open) {
      fetchCourses();
      reset();
      setError(null);
    }
  }, [open, reset]);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await axios.get(`${API_BASE_URL}/auth/courses`);
      setCourses(response.data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoadingCourses(false);
    }
  };

  const onSubmit = async (data: CreateStudentFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      if (!token) {
        setError('No access token found');
        return;
      }

      const payload = {
        mobilePhone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        state: data.state,
        city: data.city,
        referralSource: data.referralSource,
        userTypeId: "2a5982f2-0dd0-496d-9b93-5a0ebf032130",
        studentAssignCourse: [
          {
            courseId: data.courseId,
            createdBy: 'ADMIN',
            updatedBy: 'ADMIN'
          }
        ],
        studentAssignRoles: [
          {
            roleId: "85396e7c-1bf2-40cf-a03c-744fb6b9fa9f",
            createdBy: 'ADMIN',
            updatedBy: 'ADMIN'
          }
        ]
      };

      await axios.post(`${API_BASE_URL}/auth/students`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to create student:', err);
      setError(err.response?.data?.message || 'Failed to create student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon sx={{ color: '#ff6b35' }} />
            <Typography variant="h6" component="span">
              Create New Student
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* First Name and Last Name */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Box component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                  First Name <span style={{ color: '#d32f2f' }}>*</span>
                </Box>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter first name"
                      error={!!errors.firstName}
                      size="small"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ fill: 'gray', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                  )}
                />
                {errors.firstName && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <WarningAmberIcon color="error" sx={{ fontSize: 14, mr: 0.5 }} />
                    <FormHelperText error>{errors.firstName.message}</FormHelperText>
                  </Box>
                )}
              </Box>

              <Box>
                <Box component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                  Last Name <span style={{ color: '#d32f2f' }}>*</span>
                </Box>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter last name"
                      error={!!errors.lastName}
                      size="small"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ fill: 'gray', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                  )}
                />
                {errors.lastName && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <WarningAmberIcon color="error" sx={{ fontSize: 14, mr: 0.5 }} />
                    <FormHelperText error>{errors.lastName.message}</FormHelperText>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Email */}
            <Box>
              <Box component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                Email Address
              </Box>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="email"
                    placeholder="Enter email address"
                    error={!!errors.email}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ fill: 'gray', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                  />
                )}
              />
              {errors.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <WarningAmberIcon color="error" sx={{ fontSize: 14, mr: 0.5 }} />
                  <FormHelperText error>{errors.email.message}</FormHelperText>
                </Box>
              )}
            </Box>

            {/* Phone */}
            <Box>
              <Box component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                Phone Number <span style={{ color: '#d32f2f' }}>*</span>
              </Box>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Enter phone number"
                    error={!!errors.phone}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ fill: 'gray', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                  />
                )}
              />
              {errors.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <WarningAmberIcon color="error" sx={{ fontSize: 14, mr: 0.5 }} />
                  <FormHelperText error>{errors.phone.message}</FormHelperText>
                </Box>
              )}
            </Box>

            {/* Course */}
            <Box>
              <Box component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                Course Interest <span style={{ color: '#d32f2f' }}>*</span>
              </Box>
              <FormControl fullWidth error={!!errors.courseId} size="small">
                <Controller
                  name="courseId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      displayEmpty
                      disabled={loadingCourses}
                      onChange={(e) => {
                        field.onChange(e);
                        trigger('courseId');
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
                {errors.courseId && (
                  <FormHelperText>{errors.courseId.message}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* State and City */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Box component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                  State <span style={{ color: '#d32f2f' }}>*</span>
                </Box>
                <FormControl fullWidth error={!!errors.state} size="small">
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        displayEmpty
                        onChange={(e) => {
                          field.onChange(e);
                          trigger('state');
                        }}
                      >
                        <MenuItem value="">Select state</MenuItem>
                        {indianStates.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.state && (
                    <FormHelperText>{errors.state.message}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              <Box>
                <Box component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                  City <span style={{ color: '#d32f2f' }}>*</span>
                </Box>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter city"
                      error={!!errors.city}
                      size="small"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ fill: 'gray', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                  )}
                />
                {errors.city && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <WarningAmberIcon color="error" sx={{ fontSize: 14, mr: 0.5 }} />
                    <FormHelperText error>{errors.city.message}</FormHelperText>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Referral Source */}
            <Box>
              <Box component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                How did they hear about us? <span style={{ color: '#d32f2f' }}>*</span>
              </Box>
              <FormControl fullWidth error={!!errors.referralSource} size="small">
                <Controller
                  name="referralSource"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      displayEmpty
                      onChange={(e) => {
                        field.onChange(e);
                        trigger('referralSource');
                      }}
                      renderValue={(selected) => {
                        if (!selected || selected === '') {
                          return <span style={{ color: '#999' }}>Select referral source</span>;
                        }
                        return selected;
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select referral source
                      </MenuItem>
                      {referralSources.map((source) => (
                        <MenuItem key={source} value={source}>
                          {source}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.referralSource && (
                  <FormHelperText>{errors.referralSource.message}</FormHelperText>
                )}
              </FormControl>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
              },
            }}
          >
            {isSubmitting ? <CircularProgress size={20} /> : 'Create Student'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateStudentModal;

