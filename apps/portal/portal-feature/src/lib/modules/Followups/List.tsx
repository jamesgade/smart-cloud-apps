import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';

const followupSchema = z.object({
  followupType: z.enum(['HOT', 'COLD', 'WARM', 'FOLLOWUP', 'CLOSED']),
  followupDate: z.any(), // dayjs object
  notes: z.string().optional(),
  nextFollowupDate: z.any().optional().nullable(), // dayjs object
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']),
});

type FollowupFormData = z.infer<typeof followupSchema>;

interface FollowupData {
  followupId: string;
  studentId: string;
  followupType: string;
  followupDate: string;
  notes: string;
  status: string;
  nextFollowupDate: string;
  student: {
    firstName: string;
    lastName: string;
    mobilePhone: string;
    email: string;
    state: string;
    city: string;
    status: string;
    courseName: string;
  };
  assignedTo?: string | null;
  assignedToName?: string | null;
}

const FollowupsPage: React.FC = () => {
  const [followups, setFollowups] = useState<FollowupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingFollowup, setEditingFollowup] = useState<FollowupData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      nextFollowupDate: null,
    },
  });

  useEffect(() => {
    fetchFollowups();
  }, []);

  const fetchFollowups = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      if (!token) {
        setError('No access token found');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/auth/assigned-students/followups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFollowups(response.data);
    } catch (err: any) {
      console.error('Error fetching followups:', err);
      setError(err.response?.data?.message || 'Failed to fetch followups');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFollowup = (followup: FollowupData) => {
    setEditingFollowup(followup);
    resetFollowup({
      followupType: followup.followupType as any,
      followupDate: dayjs(followup.followupDate),
      notes: followup.notes || '',
      nextFollowupDate: followup.nextFollowupDate ? dayjs(followup.nextFollowupDate) : null,
      status: followup.status as any,
    });
    setEditDialogOpen(true);
  };

  const handleFollowupFormSubmit = async (data: FollowupFormData) => {
    if (!editingFollowup) return;

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

      await axios.put(`${API_BASE_URL}/auth/students/followups/${editingFollowup.followupId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchFollowups();
      setEditDialogOpen(false);
      setEditingFollowup(null);
      resetFollowup();
    } catch (err: any) {
      console.error('Error updating followup:', err);
      setError(err.response?.data?.message || 'Failed to update followup');
    } finally {
      setIsSubmitting(false);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <PhoneCallbackIcon sx={{ fontSize: 32, color: '#ff6b35' }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Assigned Students Followups
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {followups.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Student Details</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Assigned To</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Followup Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Followup Date</TableCell>
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
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {followup.student.firstName} {followup.student.lastName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {followup.student.mobilePhone}
                          </Typography>
                        </Box>
                        {followup.student.email && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {followup.student.email}
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {followup.student.city || 'N/A'}, {followup.student.state || 'N/A'}
                          </Typography>
                        </Box>
                        {followup.student.courseName && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <SchoolIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {followup.student.courseName}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {followup.assignedToName ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {followup.assignedToName}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">Unassigned</Typography>
                      )}
                    </TableCell>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No followups found for assigned students
            </Typography>
          </Paper>
        )}

        {/* Edit Followup Dialog */}
        <Dialog open={editDialogOpen} onClose={() => !isSubmitting && setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ color: '#ff6b35' }} />
                <Typography variant="h6" component="span">
                  Edit Followup
                </Typography>
              </Box>
              <IconButton onClick={() => !isSubmitting && setEditDialogOpen(false)} size="small" disabled={isSubmitting}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent>
            {editingFollowup && (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Student: {editingFollowup.student.firstName} {editingFollowup.student.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {editingFollowup.student.mobilePhone}
                </Typography>
              </Box>
            )}

            <form onSubmit={handleFollowupSubmit(handleFollowupFormSubmit)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <FormControl fullWidth error={!!followupErrors.followupType} size="small">
                    <Controller
                      name="followupType"
                      control={followupControl}
                      render={({ field }) => (
                        <>
                          <Select {...field} displayEmpty>
                            <MenuItem value="HOT">Hot</MenuItem>
                            <MenuItem value="COLD">Cold</MenuItem>
                            <MenuItem value="WARM">Warm</MenuItem>
                            <MenuItem value="FOLLOWUP">Followup</MenuItem>
                            <MenuItem value="CLOSED">Closed</MenuItem>
                          </Select>
                          {followupErrors.followupType && (
                            <FormHelperText>{followupErrors.followupType.message}</FormHelperText>
                          )}
                        </>
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
                        <>
                          <Select {...field}>
                            <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                            <MenuItem value="COMPLETED">Completed</MenuItem>
                            <MenuItem value="CANCELLED">Cancelled</MenuItem>
                            <MenuItem value="RESCHEDULED">Rescheduled</MenuItem>
                          </Select>
                          {followupErrors.status && (
                            <FormHelperText>{followupErrors.status.message}</FormHelperText>
                          )}
                        </>
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
                          textField: { fullWidth: true, size: 'small', error: !!followupErrors.followupDate },
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

                <Box>
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

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
                  <Button
                    onClick={() => {
                      setEditDialogOpen(false);
                      setEditingFollowup(null);
                      resetFollowup();
                    }}
                    disabled={isSubmitting}
                  >
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
                    {isSubmitting ? <CircularProgress size={20} /> : 'Update Followup'}
                  </Button>
                </Box>
              </Box>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default FollowupsPage;
