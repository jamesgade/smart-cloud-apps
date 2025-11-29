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
  FormHelperText,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Grid,
  Divider,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const editStudentSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  middleInitial: z.string().optional(),
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
  referralSource: z.string().optional(),
  status: z.enum(['ACTIVE', 'IN-ACTIVE']),
});

const followupSchema = z.object({
  followupType: z.enum(['HOT', 'COLD', 'WARM', 'FOLLOWUP', 'CLOSED']),
  followupDate: z.any(), // dayjs object
  notes: z.string().optional(),
  nextFollowupDate: z.any().optional().nullable(), // dayjs object
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']),
});

type EditStudentFormData = z.infer<typeof editStudentSchema>;
type ProfileFormData = {
  tenthMarksPercent?: string;
  interStream?: string;
  interFirstYearPercent?: string;
  interSecondYearPercent?: string;
  competitiveExams?: string[];
  fatherName?: string;
  fatherMobile?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherMobile?: string;
  motherOccupation?: string;
};
type FollowupFormData = z.infer<typeof followupSchema>;

interface EditStudentModalProps {
  open: boolean;
  onClose: () => void;
  studentId: string;
  onSuccess: () => void;
}

interface Course {
  course_id: string;
  name: string;
  description: string;
  status: boolean;
}

interface Followup {
  followupId: string;
  followupType: string;
  followupDate: string;
  notes: string;
  status: string;
  nextFollowupDate: string;
}

interface Application {
  application_id: string;
  application_type: string;
  application_title: string;
  application_details: string;
  status: string;
  applied_date: string;
}

interface College {
  college_id: string;
  name: string;
  type: string;
  program: string;
  state: string;
  city: string;
  assignmentId?: string;
  assignmentType?: 'INTERESTED' | 'APPLIED' | 'ADMITTED' | 'ENROLLED' | 'REJECTED' | 'WAITLISTED';
  assignmentStatus?: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED';
  college?: {
    collegeId: string;
    name: string;
    type: string;
    state: string;
    city: string;
  };
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  open,
  onClose,
  studentId,
  onSuccess,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [followupFormOpen, setFollowupFormOpen] = useState(false);
  const [editingFollowup, setEditingFollowup] = useState<Followup | null>(null);
  
  // Application/College addition states
  const [addApplicationOpen, setAddApplicationOpen] = useState(false);
  const [addCollegeOpen, setAddCollegeOpen] = useState(false);
  const [loans, setLoans] = useState<any[]>([]);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [allColleges, setAllColleges] = useState<any[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(false);
  const [loadingScholarships, setLoadingScholarships] = useState(false);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [selectedApplicationType, setSelectedApplicationType] = useState<'LOAN' | 'SCHOLARSHIP'>('LOAN');
  const [selectedLoan, setSelectedLoan] = useState<string>('');
  const [selectedScholarship, setSelectedScholarship] = useState<string>('');
  const [selectedCollege, setSelectedCollege] = useState<string>('');
  const [selectedAssignmentType, setSelectedAssignmentType] = useState<'INTERESTED' | 'APPLIED' | 'ADMITTED' | 'ENROLLED' | 'REJECTED' | 'WAITLISTED'>('INTERESTED');
  const [editingCollege, setEditingCollege] = useState<College | null>(null);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
  ];

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<EditStudentFormData>({
    resolver: zodResolver(editStudentSchema),
  });

  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    defaultValues: {},
  });

  const {
    control: followupControl,
    handleSubmit: handleFollowupSubmit,
    reset: resetFollowup,
    formState: { errors: followupErrors },
  } = useForm<FollowupFormData>({
    resolver: zodResolver(followupSchema),
    defaultValues: {
      followupType: 'FOLLOWUP',
      followupDate: dayjs(),
      notes: '',
      status: 'SCHEDULED',
    },
  });

  useEffect(() => {
    if (open && studentId) {
      fetchCourses();
      fetchStudentData();
    }
  }, [open, studentId]);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await axios.get(`${API_BASE_URL}/auth/courses`);
      setCourses(response.data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      if (!token) {
        setError('No access token found');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/auth/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const student = response.data.student;
      setFollowups(response.data.followups || []);
      setApplications(response.data.applications || []);
      
      // Fetch assigned colleges with assignment details (include all statuses)
      try {
        const assignmentsResponse = await axios.get(`${API_BASE_URL}/student-college-assignments/student/${studentId}?includeInactive=true`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setColleges(assignmentsResponse.data || []);
      } catch (err) {
        console.error('Error fetching assigned colleges:', err);
        setColleges(response.data.colleges || []);
      }

      reset({
        firstName: student.firstName,
        lastName: student.lastName,
        middleInitial: student.middleInitial || '',
        email: student.email || '',
        phone: student.mobilePhone,
        courseId: student.courseId || '',
        state: student.state || '',
        city: student.city || '',
        referralSource: student.referralSource || '',
        status: (student.status || 'ACTIVE') as 'ACTIVE' | 'IN-ACTIVE',
      });

      // Academic Profile
      try {
        const profRes = await axios.get(`${API_BASE_URL}/auth/student/profile/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p = profRes.data?.profile || profRes.data || {};
        setProfile(p);
        resetProfile({
          tenthMarksPercent: p.tenthMarksPercent?.toString() || '',
          interStream: p.interStream || '',
          interFirstYearPercent: p.interFirstYearPercent?.toString() || '',
          interSecondYearPercent: p.interSecondYearPercent?.toString() || '',
          competitiveExams: Array.isArray(p.competitiveExams) ? p.competitiveExams : [],
          fatherName: p.fatherName || '',
          fatherMobile: p.fatherMobile || '',
          fatherOccupation: p.fatherOccupation || '',
          motherName: p.motherName || '',
          motherMobile: p.motherMobile || '',
          motherOccupation: p.motherOccupation || '',
        });
      } catch (e) {
        setProfile(null);
        resetProfile({});
      }
    } catch (err: any) {
      console.error('Error fetching student data:', err);
      setError(err.response?.data?.message || 'Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoans = async () => {
    try {
      setLoadingLoans(true);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      const response = await axios.get(`${API_BASE_URL}/loans?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoans(response.data.data || []);
    } catch (err) {
      console.error('Error fetching loans:', err);
      setError('Failed to load loans');
    } finally {
      setLoadingLoans(false);
    }
  };

  const fetchScholarships = async () => {
    try {
      setLoadingScholarships(true);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      const response = await axios.get(`${API_BASE_URL}/scholarships?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setScholarships(response.data.data || []);
    } catch (err) {
      console.error('Error fetching scholarships:', err);
      setError('Failed to load scholarships');
    } finally {
      setLoadingScholarships(false);
    }
  };

  const fetchColleges = async () => {
    try {
      setLoadingColleges(true);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      const response = await axios.get(`${API_BASE_URL}/colleges?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllColleges(response.data.data || []);
    } catch (err) {
      console.error('Error fetching colleges:', err);
      setError('Failed to load colleges');
    } finally {
      setLoadingColleges(false);
    }
  };

  const handleAddApplication = async () => {
    if (!selectedLoan && !selectedScholarship) {
      setError('Please select a loan or scholarship');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      if (!token) {
        setError('No access token found');
        return;
      }

      let applicationData: any = {
        studentId: studentId,
        studentName: '',
        applicationType: selectedApplicationType,
        applicationTitle: '',
        applicationDetails: '',
      };

      if (selectedApplicationType === 'LOAN' && selectedLoan) {
        const loan = loans.find(l => l.loanId === selectedLoan);
        if (loan) {
          applicationData.studentName = `${loan.bankName || 'Loan'}`;
          applicationData.applicationTitle = loan.bankName || 'Loan Application';
          applicationData.applicationDetails = `Loan Amount: ${loan.loanAmountMin ? `₹${loan.loanAmountMin.toLocaleString()}` : 'Not specified'} - ${loan.loanAmountMax ? `₹${loan.loanAmountMax.toLocaleString()}` : 'Not specified'}, Interest Rate: ${loan.interestRate || 'Not specified'}%, Coverage: ${loan.coverageDetails || 'Not specified'}`;
        }
      } else if (selectedApplicationType === 'SCHOLARSHIP' && selectedScholarship) {
        const scholarship = scholarships.find(s => s.scholarshipId === selectedScholarship);
        if (scholarship) {
          applicationData.studentName = `${scholarship.scholarshipName || 'Scholarship'}`;
          applicationData.applicationTitle = scholarship.scholarshipName || 'Scholarship Application';
          applicationData.applicationDetails = `Amount: ${scholarship.scholarshipAmount ? `₹${scholarship.scholarshipAmount.toLocaleString()}` : 'Not specified'}, Eligibility: ${scholarship.eligibilityCriteria || 'Not specified'}`;
        }
      }

      // Get student name
      const studentResponse = await axios.get(`${API_BASE_URL}/auth/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      applicationData.studentName = `${studentResponse.data.student.firstName} ${studentResponse.data.student.lastName}`;

      await axios.post(`${API_BASE_URL}/applications`, applicationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchStudentData();
      setAddApplicationOpen(false);
      setSelectedLoan('');
      setSelectedScholarship('');
      setSelectedApplicationType('LOAN');
    } catch (err: any) {
      console.error('Error adding application:', err);
      setError(err.response?.data?.message || 'Failed to add application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCollege = async () => {
    if (!selectedCollege) {
      setError('Please select a college');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      if (!token) {
        setError('No access token found');
        return;
      }

      const collegeData = {
        studentId: studentId,
        collegeId: selectedCollege,
        assignmentType: selectedAssignmentType,
      };

      await axios.post(`${API_BASE_URL}/student-college-assignments/assign`, collegeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchStudentData();
      setAddCollegeOpen(false);
      setSelectedCollege('');
      setSelectedAssignmentType('INTERESTED');
    } catch (err: any) {
      console.error('Error assigning college:', err);
      setError(err.response?.data?.message || 'Failed to assign college');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCollege = async (assignmentId: string, assignmentType: string, assignmentStatus: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      if (!token) {
        setError('No access token found');
        return;
      }

      // Get user ID from token or local storage if available
      const userId = localStorage.getItem('USER_ID') || 'SYSTEM';

      await axios.put(`${API_BASE_URL}/student-college-assignments/${assignmentId}`, {
        assignmentType,
        assignmentStatus,
        updatedBy: userId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchStudentData();
      setEditingCollege(null);
    } catch (err: any) {
      console.error('Error updating college assignment:', err);
      setError(err.response?.data?.message || 'Failed to update college assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: EditStudentFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      if (!token) {
        setError('No access token found');
        return;
      }

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        middleInitial: data.middleInitial || '',
        email: data.email || '',
        mobilePhone: data.phone,
        state: data.state,
        city: data.city,
        status: data.status,
        studentAssignCourse: data.courseId ? [{
          courseId: data.courseId,
        }] : [],
      };

      await axios.put(`${API_BASE_URL}/auth/students/${studentId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error updating student:', err);
      setError(err.response?.data?.message || 'Failed to update student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      if (!token) { setError('No access token found'); return; }
      const payload: any = {
        tenthMarksPercent: data.tenthMarksPercent ? Number(data.tenthMarksPercent) : undefined,
        interStream: data.interStream || undefined,
        interFirstYearPercent: data.interFirstYearPercent ? Number(data.interFirstYearPercent) : undefined,
        interSecondYearPercent: data.interSecondYearPercent ? Number(data.interSecondYearPercent) : undefined,
        competitiveExams: data.competitiveExams || [],
        fatherName: data.fatherName || undefined,
        fatherMobile: data.fatherMobile || undefined,
        fatherOccupation: data.fatherOccupation || undefined,
        motherName: data.motherName || undefined,
        motherMobile: data.motherMobile || undefined,
        motherOccupation: data.motherOccupation || undefined,
      };
      const res = await axios.put(`${API_BASE_URL}/auth/student/profile/${studentId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data?.profile || payload);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFollowupFormSubmit = async (data: FollowupFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      if (!token) {
        setError('No access token found');
        return;
      }

      const payload = {
        followupType: data.followupType,
        followupDate: dayjs(data.followupDate).toISOString(),
        notes: data.notes || '',
        nextFollowupDate: data.nextFollowupDate ? dayjs(data.nextFollowupDate).toISOString() : null,
        status: data.status,
      };

      if (editingFollowup) {
        await axios.put(`${API_BASE_URL}/auth/students/followups/${editingFollowup.followupId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(`${API_BASE_URL}/auth/students/${studentId}/followups`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      await fetchStudentData();
      setFollowupFormOpen(false);
      setEditingFollowup(null);
      resetFollowup();
    } catch (err: any) {
      console.error('Error saving followup:', err);
      setError(err.response?.data?.message || 'Failed to save followup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFollowup = async (followupId: string) => {
    if (!window.confirm('Are you sure you want to delete this followup?')) {
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      if (!token) {
        setError('No access token found');
        return;
      }

      await axios.delete(`${API_BASE_URL}/auth/students/followups/${followupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchStudentData();
    } catch (err: any) {
      console.error('Error deleting followup:', err);
      setError(err.response?.data?.message || 'Failed to delete followup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditFollowup = (followup: Followup) => {
    setEditingFollowup(followup);
    resetFollowup({
      followupType: followup.followupType as any,
      followupDate: dayjs(followup.followupDate),
      notes: followup.notes || '',
      nextFollowupDate: followup.nextFollowupDate ? dayjs(followup.nextFollowupDate) : null,
      status: followup.status as any,
    });
    setFollowupFormOpen(true);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setError(null);
      setFollowupFormOpen(false);
      setEditingFollowup(null);
      resetFollowup();
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
      case 'SCHEDULED':
        return 'warning';
      case 'APPROVED':
      case 'COMPLETED':
        return 'success';
      case 'REJECTED':
      case 'CANCELLED':
        return 'error';
      case 'UNDER_REVIEW':
      case 'RESCHEDULED':
        return 'info';
      default:
        return 'default';
    }
  };

  const getFollowupTypeColor = (type: string) => {
    switch (type) {
      case 'HOT':
        return 'error';
      case 'WARM':
        return 'warning';
      case 'COLD':
        return 'info';
      case 'CLOSED':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Edit Student</Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error && !followupFormOpen ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <Box>
              {/* Student Information Section */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Student Information
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
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
                          />
                        )}
                      />
                      {errors.firstName && (
                        <FormHelperText error>{errors.firstName.message}</FormHelperText>
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
                          />
                        )}
                      />
                      {errors.lastName && (
                        <FormHelperText error>{errors.lastName.message}</FormHelperText>
                      )}
                    </Box>

                    <Box>
                      <Box component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                        Middle Initial
                      </Box>
                      <Controller
                        name="middleInitial"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            placeholder="Enter middle initial"
                            error={!!errors.middleInitial}
                            size="small"
                            inputProps={{ maxLength: 1 }}
                          />
                        )}
                      />
                      {errors.middleInitial && (
                        <FormHelperText error>{errors.middleInitial.message}</FormHelperText>
                      )}
                    </Box>

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
                            placeholder="Enter email address"
                            error={!!errors.email}
                            size="small"
                          />
                        )}
                      />
                      {errors.email && (
                        <FormHelperText error>{errors.email.message}</FormHelperText>
                      )}
                    </Box>

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
                          />
                        )}
                      />
                      {errors.phone && (
                        <FormHelperText error>{errors.phone.message}</FormHelperText>
                      )}
                    </Box>

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

                    <Box>
                      <Box component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                        Status <span style={{ color: '#d32f2f' }}>*</span>
                      </Box>
                      <FormControl fullWidth error={!!errors.status} size="small">
                        <Controller
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <Select {...field}>
                              <MenuItem value="ACTIVE">Active</MenuItem>
                              <MenuItem value="IN-ACTIVE">Inactive</MenuItem>
                            </Select>
                          )}
                        />
                        {errors.status && (
                          <FormHelperText>{errors.status.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </Box>

                  {/* State, City, Referral */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
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
                          />
                        )}
                      />
                      {errors.city && (
                        <FormHelperText error>{errors.city.message}</FormHelperText>
                      )}
                    </Box>

                    <Box>
                      <Box component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                        How did they hear about us?
                      </Box>
                      <Controller
                        name="referralSource"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            placeholder="Not captured"
                            size="small"
                            disabled
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                </form>
              </Paper>

              {/* Academic & Family (Editable) */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Academic & Family Information
                </Typography>
                <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <Controller name="tenthMarksPercent" control={profileControl} render={({ field }) => (
                      <TextField {...field} label="10th Marks (%)" size="small" type="number" inputProps={{ min: 0, max: 100, step: 0.01 }} />
                    )} />
                    <Controller name="interStream" control={profileControl} render={({ field }) => (
                      <TextField {...field} label="Intermediate Stream (e.g., MPC)" size="small" />
                    )} />
                    <Controller name="interFirstYearPercent" control={profileControl} render={({ field }) => (
                      <TextField {...field} label="Inter 1st Year (%)" size="small" type="number" inputProps={{ min: 0, max: 100, step: 0.01 }} />
                    )} />
                    <Controller name="interSecondYearPercent" control={profileControl} render={({ field }) => (
                      <TextField {...field} label="Inter 2nd Year (%)" size="small" type="number" inputProps={{ min: 0, max: 100, step: 0.01 }} />
                    )} />
                    <Controller name="competitiveExams" control={profileControl} render={({ field }) => (
                      <TextField {...field} label="Competitive Exams (comma separated)" size="small" onChange={(e)=> field.onChange(e.target.value.split(',').map((s:string)=> s.trim()).filter(Boolean))} value={(field.value||[]).join(', ')} />
                    )} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ mt: 2 }}>Father</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                    <Controller name="fatherName" control={profileControl} render={({ field }) => (<TextField {...field} label="Name" size="small" />)} />
                    <Controller name="fatherMobile" control={profileControl} render={({ field }) => (<TextField {...field} label="Mobile" size="small" />)} />
                    <Controller name="fatherOccupation" control={profileControl} render={({ field }) => (<TextField {...field} label="Occupation" size="small" />)} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ mt: 2 }}>Mother</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                    <Controller name="motherName" control={profileControl} render={({ field }) => (<TextField {...field} label="Name" size="small" />)} />
                    <Controller name="motherMobile" control={profileControl} render={({ field }) => (<TextField {...field} label="Mobile" size="small" />)} />
                    <Controller name="motherOccupation" control={profileControl} render={({ field }) => (<TextField {...field} label="Occupation" size="small" />)} />
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)', '&:hover': { background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)' } }}>{isSubmitting ? <CircularProgress size={20} /> : 'Save Academic & Family'}</Button>
                  </Box>
                </form>
              </Paper>

              {/* Followups Section */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Followups
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      resetFollowup({
                        followupType: 'FOLLOWUP',
                        followupDate: dayjs(),
                        notes: '',
                        status: 'SCHEDULED',
                      });
                      setEditingFollowup(null);
                      setFollowupFormOpen(true);
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
                      },
                    }}
                  >
                    Add Followup
                  </Button>
                </Box>

                {followupFormOpen && (
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {editingFollowup ? 'Edit Followup' : 'New Followup'}
                    </Typography>
                    <form onSubmit={handleFollowupSubmit(handleFollowupFormSubmit)}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <Box>
                          <FormControl fullWidth error={!!followupErrors.followupType} size="small">
                            <Controller
                              name="followupType"
                              control={followupControl}
                              render={({ field }) => (
                                <Select {...field} displayEmpty>
                                  <MenuItem value="HOT">Hot</MenuItem>
                                  <MenuItem value="COLD">Cold</MenuItem>
                                  <MenuItem value="WARM">Warm</MenuItem>
                                  <MenuItem value="FOLLOWUP">Followup</MenuItem>
                                  <MenuItem value="CLOSED">Closed</MenuItem>
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Box>

                        <Box>
                          <FormControl fullWidth error={!!followupErrors.status} size="small">
                            <Controller
                              name="status"
                              control={followupControl}
                              render={({ field }) => (
                                <Select {...field}>
                                  <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                                  <MenuItem value="COMPLETED">Completed</MenuItem>
                                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                                  <MenuItem value="RESCHEDULED">Rescheduled</MenuItem>
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Box>

                        <Box>
                          <Controller
                            name="followupDate"
                            control={followupControl}
                            render={({ field }) => (
                              <DateTimePicker
                                label="Followup Date"
                                value={field.value}
                                onChange={field.onChange}
                                slotProps={{
                                  textField: { fullWidth: true, size: 'small' },
                                }}
                              />
                            )}
                          />
                        </Box>

                        <Box>
                          <Controller
                            name="nextFollowupDate"
                            control={followupControl}
                            render={({ field }) => (
                              <DateTimePicker
                                label="Next Followup Date (Optional)"
                                value={field.value}
                                onChange={field.onChange}
                                slotProps={{
                                  textField: { fullWidth: true, size: 'small' },
                                }}
                              />
                            )}
                          />
                        </Box>

                        <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                          <Controller
                            name="notes"
                            control={followupControl}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={3}
                                label="Notes"
                                placeholder="Enter followup notes"
                              />
                            )}
                          />
                        </Box>

                        <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
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
                              {isSubmitting ? <CircularProgress size={20} /> : 'Save Followup'}
                            </Button>
                            <Button
                              onClick={() => {
                                setFollowupFormOpen(false);
                                setEditingFollowup(null);
                                resetFollowup();
                              }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </form>
                  </Paper>
                )}

                {followups.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Notes</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Next Followup</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {followups.map((followup) => (
                          <TableRow key={followup.followupId}>
                            <TableCell>
                              <Chip
                                label={followup.followupType.replace('_', ' ')}
                                size="small"
                                color={getFollowupTypeColor(followup.followupType) as any}
                              />
                            </TableCell>
                            <TableCell>{formatDate(followup.followupDate)}</TableCell>
                            <TableCell>
                              <Chip
                                label={followup.status}
                                size="small"
                                color={getStatusColor(followup.status) as any}
                              />
                            </TableCell>
                            <TableCell>{followup.notes || 'N/A'}</TableCell>
                            <TableCell>
                              {followup.nextFollowupDate ? formatDate(followup.nextFollowupDate) : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleEditFollowup(followup)}
                                disabled={isSubmitting}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteFollowup(followup.followupId)}
                                disabled={isSubmitting}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No followups recorded
                  </Typography>
                )}
              </Paper>

              {/* Applications Section */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Applications ({applications.length})
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setAddApplicationOpen(true);
                      fetchLoans();
                      fetchScholarships();
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
                      },
                    }}
                  >
                    Add Application
                  </Button>
                </Box>

                {addApplicationOpen && (
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Add Application
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <Box>
                        <FormControl fullWidth size="small">
                          <Select
                            value={selectedApplicationType}
                            onChange={(e) => {
                              setSelectedApplicationType(e.target.value as 'LOAN' | 'SCHOLARSHIP');
                              setSelectedLoan('');
                              setSelectedScholarship('');
                            }}
                          >
                            <MenuItem value="LOAN">Loan</MenuItem>
                            <MenuItem value="SCHOLARSHIP">Scholarship</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box>
                        <FormControl fullWidth size="small" disabled={loadingLoans || loadingScholarships}>
                          {selectedApplicationType === 'LOAN' ? (
                            <Select
                              value={selectedLoan}
                              onChange={(e) => setSelectedLoan(e.target.value)}
                              displayEmpty
                            >
                              <MenuItem value="" disabled>
                                {loadingLoans ? 'Loading loans...' : 'Select Loan'}
                              </MenuItem>
                              {loans.map((loan) => (
                                <MenuItem key={loan.loanId} value={loan.loanId}>
                                  {loan.bankName}
                                </MenuItem>
                              ))}
                            </Select>
                          ) : (
                            <Select
                              value={selectedScholarship}
                              onChange={(e) => setSelectedScholarship(e.target.value)}
                              displayEmpty
                            >
                              <MenuItem value="" disabled>
                                {loadingScholarships ? 'Loading scholarships...' : 'Select Scholarship'}
                              </MenuItem>
                              {scholarships.map((scholarship) => (
                                <MenuItem key={scholarship.scholarshipId} value={scholarship.scholarshipId}>
                                  {scholarship.scholarshipName}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        </FormControl>
                      </Box>
                      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            onClick={handleAddApplication}
                            disabled={isSubmitting || (!selectedLoan && !selectedScholarship)}
                            sx={{
                              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
                              },
                            }}
                          >
                            {isSubmitting ? <CircularProgress size={20} /> : 'Apply'}
                          </Button>
                          <Button
                            onClick={() => {
                              setAddApplicationOpen(false);
                              setSelectedLoan('');
                              setSelectedScholarship('');
                              setSelectedApplicationType('LOAN');
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                )}
                {applications.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Applied Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {applications.map((app) => (
                          <TableRow key={app.application_id}>
                            <TableCell>
                              <Chip
                                label={app.application_type}
                                size="small"
                                color={app.application_type === 'LOAN' ? 'primary' : 'secondary'}
                              />
                            </TableCell>
                            <TableCell>{app.application_title}</TableCell>
                            <TableCell>
                              <Chip
                                label={app.status}
                                size="small"
                                color={getStatusColor(app.status) as any}
                              />
                            </TableCell>
                            <TableCell>{formatDate(app.applied_date)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No applications found
                  </Typography>
                )}
              </Paper>

              {/* Colleges Section */}
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Assigned Colleges ({colleges.length})
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setAddCollegeOpen(true);
                      fetchColleges();
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
                      },
                    }}
                  >
                    Assign College
                  </Button>
                </Box>

                {addCollegeOpen && (
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Assign College
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth size="small" disabled={loadingColleges}>
                          <Select
                            value={selectedCollege}
                            onChange={(e) => setSelectedCollege(e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              {loadingColleges ? 'Loading colleges...' : 'Select College'}
                            </MenuItem>
                            {allColleges.map((college) => (
                              <MenuItem key={college.collegeId} value={college.collegeId}>
                                {college.name} - {college.city}, {college.state}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl fullWidth size="small">
                          <Select
                            value={selectedAssignmentType}
                            onChange={(e) => setSelectedAssignmentType(e.target.value as any)}
                            displayEmpty
                          >
                            <MenuItem value="INTERESTED">INTERESTED</MenuItem>
                            <MenuItem value="APPLIED">APPLIED</MenuItem>
                            <MenuItem value="ADMITTED">ADMITTED</MenuItem>
                            <MenuItem value="ENROLLED">ENROLLED</MenuItem>
                            <MenuItem value="REJECTED">REJECTED</MenuItem>
                            <MenuItem value="WAITLISTED">WAITLISTED</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            onClick={handleAddCollege}
                            disabled={isSubmitting || !selectedCollege}
                            sx={{
                              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
                              },
                            }}
                          >
                            {isSubmitting ? <CircularProgress size={20} /> : 'Assign'}
                          </Button>
                          <Button
                            onClick={() => {
                              setAddCollegeOpen(false);
                              setSelectedCollege('');
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                )}
                {colleges.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>College Name</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>College Type</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>College Program</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Assignment Type</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {colleges.map((college) => {
                          const collegeData = college.college || college;
                          return (
                            <TableRow key={college.assignmentId || college.college_id}>
                              <TableCell>{collegeData.name}</TableCell>
                              <TableCell>{collegeData.type || 'N/A'}</TableCell>
                              <TableCell>
                                {'program' in collegeData && (collegeData as { program?: string }).program
                                  ? (collegeData as { program?: string }).program
                                  : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={college.assignmentType || 'INTERESTED'}
                                  size="small"
                                  color={
                                    college.assignmentType === 'ENROLLED' ? 'success' :
                                    college.assignmentType === 'ADMITTED' ? 'success' :
                                    college.assignmentType === 'APPLIED' ? 'info' :
                                    college.assignmentType === 'REJECTED' ? 'error' :
                                    college.assignmentType === 'WAITLISTED' ? 'warning' :
                                    'default'
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={college.assignmentStatus || 'ACTIVE'}
                                  size="small"
                                  color={
                                    college.assignmentStatus === 'ACTIVE' ? 'success' :
                                    college.assignmentStatus === 'COMPLETED' ? 'info' :
                                    college.assignmentStatus === 'CANCELLED' ? 'error' :
                                    college.assignmentStatus === 'INACTIVE' ? 'warning' :
                                    'default'
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                {collegeData.city || 'N/A'}, {collegeData.state || 'N/A'}
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => setEditingCollege(college)}
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No colleges assigned
                  </Typography>
                )}
              </Paper>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={isSubmitting}
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
              },
            }}
          >
            {isSubmitting ? <CircularProgress size={20} /> : 'Update Student'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit College Assignment Dialog */}
      <Dialog open={!!editingCollege} onClose={() => setEditingCollege(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit College Assignment
        </DialogTitle>
        <DialogContent>
          {editingCollege && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                College: {editingCollege.college?.name || editingCollege.name}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <FormControl fullWidth>
                  <Typography variant="subtitle2" gutterBottom>
                    Assignment Type
                  </Typography>
                  <Select
                    value={editingCollege.assignmentType || 'INTERESTED'}
                    onChange={(e) => setEditingCollege({
                      ...editingCollege,
                      assignmentType: e.target.value as any
                    })}
                  >
                    <MenuItem value="INTERESTED">INTERESTED</MenuItem>
                    <MenuItem value="APPLIED">APPLIED</MenuItem>
                    <MenuItem value="ADMITTED">ADMITTED</MenuItem>
                    <MenuItem value="ENROLLED">ENROLLED</MenuItem>
                    <MenuItem value="REJECTED">REJECTED</MenuItem>
                    <MenuItem value="WAITLISTED">WAITLISTED</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <Typography variant="subtitle2" gutterBottom>
                    Status
                  </Typography>
                  <Select
                    value={editingCollege.assignmentStatus || 'ACTIVE'}
                    onChange={(e) => setEditingCollege({
                      ...editingCollege,
                      assignmentStatus: e.target.value as any
                    })}
                  >
                    <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                    <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                    <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                    <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingCollege(null)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (editingCollege && editingCollege.assignmentId) {
                handleUpdateCollege(
                  editingCollege.assignmentId,
                  editingCollege.assignmentType || 'INTERESTED',
                  editingCollege.assignmentStatus || 'ACTIVE'
                );
              }
            }}
            variant="contained"
            disabled={isSubmitting}
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
              },
            }}
          >
            {isSubmitting ? <CircularProgress size={20} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EditStudentModal;
