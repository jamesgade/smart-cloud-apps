import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  TextField,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  AccountBalance as BankIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';

interface StudentDetails {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  state: string;
  city: string;
  referralSource?: string;
  status: string;
  courseName: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

interface Application {
  application_id: string;
  application_type: string;
  application_title: string;
  application_details: string;
  status: string;
  applied_date: string;
  reviewed_date: string;
  review_notes: string;
}

interface College {
  college_id: string;
  name: string;
  type: string;
  program: string;
  state: string;
  city: string;
  fees: string;
  rating?: number | string | null;
  assignmentId?: string;
  assignmentType?: 'INTERESTED' | 'APPLIED' | 'ADMITTED' | 'ENROLLED' | 'REJECTED' | 'WAITLISTED';
  assignmentStatus?: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED';
  college?: {
    collegeId: string;
    name: string;
    type: string;
    state: string;
    city: string;
    rating?: number | string | null;
  };
}

interface Followup {
  followupId: string;
  followupType: string;
  followupDate: string;
  notes: string;
  status: string;
  nextFollowupDate: string;
}

interface ViewStudentModalProps {
  open: boolean;
  onClose: () => void;
  studentId: string;
  onEdit?: () => void;
}

const ViewStudentModal: React.FC<ViewStudentModalProps> = ({
  open,
  onClose,
  studentId,
  onEdit,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (open && studentId) {
      fetchStudentDetails();
    }
  }, [open, studentId]);

  const fetchStudentDetails = async () => {
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

      setStudentDetails(response.data.student);
      setApplications(response.data.applications || []);
      setFollowups(response.data.followups || []);

      try {
        const profileRes = await axios.get(`${API_BASE_URL}/auth/student/profile/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileRes.data?.profile || profileRes.data || null);
      } catch (e) {
        setProfile(null);
      }

      // Fetch assigned colleges with assignment details
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
    } catch (err: any) {
      console.error('Error fetching student details:', err);
      setError(err.response?.data?.message || 'Failed to fetch student details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'success';
      case 'IN-ACTIVE':
        return 'error';
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'UNDER_REVIEW':
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
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon sx={{ color: '#ff6b35' }} />
            <Typography variant="h6" component="span">
              Student Details
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : studentDetails ? (
          <Box sx={{ pt: 2 }}>
            {/* Student Basic Information (read-only, same layout as edit) */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Student Information
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField label="First Name" value={studentDetails.firstName || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Last Name" value={studentDetails.lastName || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Middle Initial" value={(studentDetails as any).middleInitial || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Email Address" value={studentDetails.email || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Phone Number" value={studentDetails.mobilePhone || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Course Interest" value={studentDetails.courseName || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="State" value={studentDetails.state || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="City" value={studentDetails.city || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Referral Source" value={studentDetails.referralSource || 'Not captured'} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Status" value={studentDetails.status || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Joined Date" value={formatDate(studentDetails.createdAt)} size="small" fullWidth InputProps={{ readOnly: true }} />
              </Box>
            </Paper>

            {/* Academic & Family (read-only, same layout as edit) */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Academic & Family Information
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField label="10th Marks (%)" value={profile?.tenthMarksPercent ?? ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Intermediate Stream (e.g., MPC)" value={profile?.interStream || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Inter 1st Year (%)" value={profile?.interFirstYearPercent ?? ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Inter 2nd Year (%)" value={profile?.interSecondYearPercent ?? ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Competitive Exams (comma separated)" value={Array.isArray(profile?.competitiveExams) ? profile.competitiveExams.join(', ') : ''} size="small" fullWidth InputProps={{ readOnly: true }} />
              </Box>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Father</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                <TextField label="Name" value={profile?.fatherName || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Mobile" value={profile?.fatherMobile || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Occupation" value={profile?.fatherOccupation || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
              </Box>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>Mother</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                <TextField label="Name" value={profile?.motherName || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Mobile" value={profile?.motherMobile || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Occupation" value={profile?.motherOccupation || ''} size="small" fullWidth InputProps={{ readOnly: true }} />
              </Box>
            </Paper>

            {/* Applications */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BusinessIcon sx={{ color: '#ff6b35' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Applications ({applications.length})
                </Typography>
              </Box>
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

            {/* Colleges */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SchoolIcon sx={{ color: '#ff6b35' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Assigned Colleges ({colleges.length})
                </Typography>
              </Box>
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
                        <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {colleges.map((college) => {
                        const collegeData = college.college || college;
                        const rating = collegeData.rating;
                        const ratingValue = typeof rating === 'string' ? parseFloat(rating) : rating;
                        const isValidRating = ratingValue !== null && ratingValue !== undefined && !isNaN(ratingValue) && isFinite(ratingValue);
                        
                        return (
                          <TableRow key={college.assignmentId || college.college_id || college.college?.collegeId}>
                            <TableCell>{collegeData.name}</TableCell>
                            <TableCell>{collegeData.type || 'N/A'}</TableCell>
                            <TableCell>
                              {'program' in collegeData && (collegeData as { program?: string }).program
                                ? (collegeData as { program?: string }).program
                                : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {college.assignmentType ? (
                                <Chip
                                  label={college.assignmentType}
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
                              ) : (
                                'N/A'
                              )}
                            </TableCell>
                            <TableCell>
                              {college.assignmentStatus ? (
                                <Chip
                                  label={college.assignmentStatus}
                                  size="small"
                                  color={
                                    college.assignmentStatus === 'ACTIVE' ? 'success' :
                                    college.assignmentStatus === 'COMPLETED' ? 'info' :
                                    college.assignmentStatus === 'CANCELLED' ? 'error' :
                                    college.assignmentStatus === 'INACTIVE' ? 'warning' :
                                    'default'
                                  }
                                />
                              ) : (
                                'N/A'
                              )}
                            </TableCell>
                            <TableCell>
                              {collegeData.city || 'N/A'}, {collegeData.state || 'N/A'}
                            </TableCell>
                            <TableCell>
                              {isValidRating ? (
                                <Chip label={ratingValue.toFixed(1)} size="small" color="primary" />
                              ) : (
                                'N/A'
                              )}
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

            {/* Followups */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PhoneIcon sx={{ color: '#ff6b35' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Followups ({followups.length})
                </Typography>
              </Box>
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
                            <Chip label={followup.status} size="small" />
                          </TableCell>
                          <TableCell>{followup.notes || 'N/A'}</TableCell>
                          <TableCell>
                            {followup.nextFollowupDate ? formatDate(followup.nextFollowupDate) : 'N/A'}
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
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        {onEdit && (
          <Button
            onClick={onEdit}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
              },
            }}
          >
            Edit Student
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewStudentModal;

