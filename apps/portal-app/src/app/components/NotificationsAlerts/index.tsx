import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { applicationService, Application } from '../../services/applicationService';
import { useGetIdentity } from '@refinedev/core';
import axios from 'axios';
import { API_BASE_URL } from '../../libs/constants';

interface Appointment {
  appointment_id: string;
  title: string;
  description?: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  counsellor: {
    first_name: string;
    last_name: string;
    email: string;
  };
  status: {
    status_code: string;
    status_name: string;
  };
}

const NotificationsAlerts: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'APPROVED' | 'REJECTED' | 'UNDER_REVIEW'>('UNDER_REVIEW');
  const [reviewNotes, setReviewNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const { data: identity } = useGetIdentity();

  const isStudent = identity?.userTypeName?.toLowerCase() === 'student' || identity?.roleName?.toLowerCase() === 'student';

  useEffect(() => {
    if (isStudent) {
      loadAppointments();
    } else {
      loadApplications();
    }
  }, [isStudent]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      if (!token) {
        setError('No access token found');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allAppointments = Array.isArray(response.data?.data) 
        ? response.data.data 
        : (Array.isArray(response.data) ? response.data : []);

      // Filter for confirmed appointments only
      const confirmedAppointments = allAppointments.filter(
        (apt: Appointment) => apt.status?.status_code === 'CONFIRMED'
      );

      setAppointments(confirmedAppointments);
    } catch (err) {
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationService.getAllApplications();
      setApplications(data);
    } catch (err) {
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewApplication = (application: Application) => {
    setSelectedApplication(application);
    setReviewStatus(application.status as 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW');
    setReviewNotes(application.reviewNotes || '');
    setReviewDialogOpen(true);
  };

  const handleUpdateApplication = async () => {
    if (!selectedApplication || !identity?.userId) return;

    try {
      setUpdating(true);
      setError(null);

      await applicationService.updateApplication(selectedApplication.applicationId, {
        status: reviewStatus,
        reviewedBy: identity.userId,
        reviewNotes: reviewNotes,
      });

      setReviewDialogOpen(false);
      await loadApplications();
      alert('Application updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update application. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'UNDER_REVIEW': return 'info';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'LOAN': return 'primary';
      case 'SCHOLARSHIP': return 'secondary';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // Time is in HH:MM:SS format, extract HH:MM
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render student view - confirmed appointments
  if (isStudent) {
    return (
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#333' }}>
            Notifications
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            View your confirmed counselling sessions
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {appointments.length > 0 ? (
          <Card>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Counsellor</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.appointment_id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ color: '#666' }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {appointment.counsellor?.first_name} {appointment.counsellor?.last_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {appointment.title}
                          </Typography>
                          {appointment.description && (
                            <Typography variant="caption" color="text.secondary">
                              {appointment.description.substring(0, 50)}
                              {appointment.description.length > 50 ? '...' : ''}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ScheduleIcon sx={{ color: '#666', fontSize: 16 }} />
                            <Typography variant="body2">
                              {formatDate(appointment.appointment_date)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={appointment.status?.status_name || 'Confirmed'}
                            size="small"
                            color="success"
                            variant="filled"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <ScheduleIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                No confirmed sessions
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Confirmed counselling sessions will appear here
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    );
  }

  // Render admin/counsellor view - applications
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#333' }}>
          Applications & Notifications
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Review and manage student applications for loans and scholarships
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {applications.length > 0 ? (
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Applied Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.applicationId}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ color: '#666' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {application.studentName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={application.applicationType}
                          size="small"
                          color="default"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {application.applicationTitle}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={application.status}
                          size="small"
                          color={getStatusColor(application.status)}
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon sx={{ color: '#666', fontSize: 16 }} />
                          <Typography variant="body2">
                            {formatDate(application.appliedDate)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => handleReviewApplication(application)}
                          sx={{
                            borderColor: '#FF6B35',
                            color: '#FF6B35',
                            '&:hover': {
                              borderColor: '#FF6B35',
                              backgroundColor: 'rgba(255, 107, 53, 0.08)',
                            },
                          }}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <AssignmentIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
              No applications found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Applications will appear here when students submit them
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Review Application</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Application Details
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Student Name</Typography>
                    <Typography variant="body1">{selectedApplication.studentName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Application Type</Typography>
                    <Typography variant="body1">{selectedApplication.applicationType}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Title</Typography>
                    <Typography variant="body1">{selectedApplication.applicationTitle}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Applied Date</Typography>
                    <Typography variant="body1">{formatDate(selectedApplication.appliedDate)}</Typography>
                  </Box>
                </Box>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value as 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW')}
                  label="Status"
                >
                  <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Review Notes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add your review notes here..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateApplication}
            disabled={updating}
            variant="contained"
            sx={{
              backgroundColor: '#FF6B35',
              '&:hover': { backgroundColor: '#e55a2b' },
            }}
          >
            {updating ? <CircularProgress size={20} color="inherit" /> : 'Update Application'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationsAlerts;
