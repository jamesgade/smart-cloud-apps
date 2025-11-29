import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

const createAppointmentSchema = (userType: string, roleName?: string) => {
  const isStudent = userType === 'Student';
  const isCounsellor = roleName === 'Counsellor' || userType === 'Counsellor' || userType === 'Senior Counsellor';
  const isAdmin = userType === 'Admin' || userType === 'Manager';
  
  return z.object({
    counsellor_id: isStudent ? z.string().nonempty('Please select a counsellor') : z.string().optional(),
    student_id: (isCounsellor || isAdmin) ? z.string().nonempty('Please select a student') : z.string().optional(),
    title: z.string().nonempty('Title is required'),
    description: z.string().optional(),
    appointment_date: z.string().nonempty('Date is required'),
    start_time: z.string().nonempty('Start time is required')
      .refine((time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const timeInMinutes = hours * 60 + minutes;
        return timeInMinutes >= 540 && timeInMinutes <= 1140; // 9:00 AM to 7:00 PM
      }, {
        message: 'Start time must be between 9:00 AM and 7:00 PM',
      }),
    end_time: z.string().nonempty('End time is required')
      .refine((time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const timeInMinutes = hours * 60 + minutes;
        return timeInMinutes >= 540 && timeInMinutes <= 1140; // 9:00 AM to 7:00 PM
      }, {
        message: 'End time must be between 9:00 AM and 7:00 PM',
      }),
  }).refine((data) => {
    if (data.start_time && data.end_time) {
      return data.end_time > data.start_time;
    }
    return true;
  }, {
    message: 'End time must be after start time',
    path: ['end_time'],
  });
};

type AppointmentFormData = z.infer<ReturnType<typeof createAppointmentSchema>>;

interface Counsellor {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Student {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface CreateAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate?: Date;
  selectedTime?: { start: string; end: string };
  onSuccess: () => void;
  studentId: string;
  userType: string;
  userId: string;
  roleName?: string;
  existingEvents?: Array<{ start: string; end: string; appointment_id: string }>;
}

export const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  open,
  onClose,
  selectedDate,
  selectedTime,
  onSuccess,
  studentId,
  userType,
  userId,
  roleName,
  existingEvents = [],
}) => {
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingCounsellors, setLoadingCounsellors] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api';

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(createAppointmentSchema(userType, roleName)),
  });

  const startTime = watch('start_time');
  const appointmentDate = watch('appointment_date');

  // Auto-calculate end time when start time changes
  useEffect(() => {
    if (startTime) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
      
      // Add 30 minutes
      const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);
      
      // Check if end time exceeds 7 PM (19:00)
      if (endDate.getHours() > 19 || (endDate.getHours() === 19 && endDate.getMinutes() > 0)) {
        // Set end time to 7 PM if it would exceed business hours
        setValue('end_time', '19:00');
      } else {
        const endTimeStr = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
        setValue('end_time', endTimeStr);
      }
    }
  }, [startTime, setValue]);

  const checkTimeSlotConflict = (date: string, start: string, end: string) => {
    return existingEvents.some(event => {
      // Extract date from event start
      const eventDate = event.start.split('T')[0];
      if (eventDate !== date) return false;
      
      // Check for time overlap
      const selectedStart = `${date}T${start}`;
      const selectedEnd = `${date}T${end}`;
      
      return (
        (selectedStart < event.end && selectedEnd > event.start) ||
        (event.start < selectedEnd && event.end > selectedStart)
      );
    });
  };

  const isStudent = userType === 'Student';
  const isCounsellor = roleName === 'Counsellor' || roleName === 'Senior Counsellor' || userType === 'Counsellor' || userType === 'Senior Counsellor';
  const isAdmin = userType === 'Admin' || userType === 'Manager';


  useEffect(() => {
    if (open) {
      if (isStudent) {
        fetchCounsellors();
      } else if (isCounsellor || isAdmin) {
        fetchStudents();
      }
      if (selectedDate) {
        // Use local timezone to avoid date shifting
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const localDateString = `${year}-${month}-${day}`;
        setValue('appointment_date', localDateString);
      }
      if (selectedTime) {
        setValue('start_time', selectedTime.start);
        setValue('end_time', selectedTime.end);
      }
    }
  }, [open, selectedDate, selectedTime, isStudent, isCounsellor, isAdmin]);

  const fetchCounsellors = async () => {
    const token = localStorage.getItem('ACCESS_TOKEN_KEY');
    if (!token) {
      setError('No access token found');
      setLoadingCounsellors(false);
      return;
    }

    try {
      setLoadingCounsellors(true);
      
      // For students, fetch all counsellors
      let counsellorsResponse;
      try {
        counsellorsResponse = await axios.get(`${API_BASE_URL}/appointments/counsellors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (paramErr) {
        // If that endpoint doesn't work, try the student-assignments endpoint
        try {
          counsellorsResponse = await axios.get(`${API_BASE_URL}/student-assignments/counsellors`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (altErr) {
          throw new Error('Failed to fetch counsellors');
        }
      }

      const allCounsellors = counsellorsResponse.data || [];

      // Filter to show only Counsellors and Senior Counsellors
      const filteredCounsellors = allCounsellors.filter((counsellor: any) => {
        const roleName = (counsellor.roleName || counsellor.role_name || '').toLowerCase();
        return roleName === 'counsellor' || roleName === 'senior counsellor';
      });

      setCounsellors(filteredCounsellors);
    } catch (err: any) {
      setError('Failed to load counsellors');
      setCounsellors([]);
    } finally {
      setLoadingCounsellors(false);
    }
  };

  const fetchStudents = async () => {
    const token = localStorage.getItem('ACCESS_TOKEN_KEY');
    if (!token) {
      setError('No access token found');
      setLoadingStudents(false);
      return;
    }

    try {
      setLoadingStudents(true);
      
      // ALL roles (counsellors, admins, managers) use the assigned students endpoint
      // The backend automatically filters by userId from the token for all roles
      const assignmentsResponse = await axios.get(`${API_BASE_URL}/student-assignments/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const studentsList = Array.isArray(assignmentsResponse.data?.data) 
        ? assignmentsResponse.data.data 
        : (Array.isArray(assignmentsResponse.data) ? assignmentsResponse.data : []);

      setStudents(studentsList);
    } catch (err: any) {
      // If the endpoint fails, return empty array (all roles should only see assigned students)
      setError('Failed to load students');
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');

      // Check for time slot conflicts before submitting
      if (checkTimeSlotConflict(data.appointment_date, data.start_time, data.end_time)) {
        setError('This time slot conflicts with an existing appointment. Please select a different time.');
        setSubmitting(false);
        return;
      }

      // Prepare appointment data based on user type
      let finalStudentId: string;
      let finalCounsellorId: string;

      if (isStudent) {
        // For students, use their studentId (not userId)
        finalStudentId = studentId;
        finalCounsellorId = data.counsellor_id!;
      } else if (isCounsellor || isAdmin) {
        // For counsellors/admins, use selected student and current user as counsellor
        if (!data.student_id) {
          setError('Please select a student for the appointment');
          setSubmitting(false);
          return;
        }
        finalStudentId = data.student_id;
        finalCounsellorId = userId;
      } else {
        setError('Invalid user type for creating appointments');
        setSubmitting(false);
        return;
      }

      const appointmentData = {
        ...data,
        student_id: finalStudentId,
        counsellor_id: finalCounsellorId,
      };
      

      await axios.post(
        `${API_BASE_URL}/appointments`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      reset();
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create appointment');
    } finally {
      setSubmitting(false);
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
        {isStudent ? 'Book Counselling Appointment' : 'Schedule Appointment with Student'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Counsellor Selection (for students) */}
          {isStudent && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Counsellor *</InputLabel>
              <Controller
                name="counsellor_id"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Select Counsellor *" error={!!errors.counsellor_id}>
                    {loadingCounsellors ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
                      </MenuItem>
                    ) : counsellors.length === 0 ? (
                      <MenuItem disabled>No counsellors available</MenuItem>
                    ) : (
                      counsellors.map((counsellor) => (
                        <MenuItem key={counsellor.user_id} value={counsellor.user_id}>
                          {counsellor.first_name} {counsellor.last_name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                )}
              />
              {errors.counsellor_id && (
                <Typography variant="caption" color="error">
                  {errors.counsellor_id.message}
                </Typography>
              )}
            </FormControl>
          )}

          {/* Student Selection (for counsellors and admins) */}
          {(isCounsellor || isAdmin) && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Student *</InputLabel>
              <Controller
                name="student_id"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Select Student *" error={!!errors.student_id}>
                    {loadingStudents ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
                      </MenuItem>
                    ) : students.length === 0 ? (
                      <MenuItem disabled>No students available</MenuItem>
                    ) : (
                      students.map((student) => (
                        <MenuItem key={student.user_id} value={student.user_id}>
                          {student.first_name} {student.last_name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                )}
              />
              {errors.student_id && (
                <Typography variant="caption" color="error">
                  {errors.student_id.message}
                </Typography>
              )}
            </FormControl>
          )}

          {/* Title */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Appointment Title *"
                fullWidth
                sx={{ mb: 2 }}
                error={!!errors.title}
                helperText={errors.title?.message}
                placeholder="e.g., Career Guidance, Course Selection"
              />
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
                placeholder="What would you like to discuss?"
              />
            )}
          />

          {/* Date */}
          <Controller
            name="appointment_date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Appointment Date *"
                type="date"
                fullWidth
                sx={{ mb: 2 }}
                error={!!errors.appointment_date}
                helperText={errors.appointment_date?.message}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0],
                }}
              />
            )}
          />

          {/* Start Time */}
          <Controller
            name="start_time"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Start Time"
                type="time"
                fullWidth
                sx={{ mb: 2 }}
                error={!!errors.start_time}
                helperText={errors.start_time?.message || 'Business hours: 9:00 AM to 7:00 PM'}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: '09:00',
                  max: '19:00',
                  step: 900, // 15 minute steps
                }}
              />
            )}
          />

          {/* End Time */}
          <Controller
            name="end_time"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="End Time"
                type="time"
                fullWidth
                sx={{ mb: 2 }}
                error={!!errors.end_time}
                helperText={errors.end_time?.message || 'Automatically set to start time + 30 minutes (max 7:00 PM)'}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: '09:00',
                  max: '19:00',
                  step: 900, // 15 minute steps
                }}
                disabled
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={submitting}
          sx={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
            },
          }}
        >
          {submitting ? 'Creating...' : 'Book Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAppointmentModal;

