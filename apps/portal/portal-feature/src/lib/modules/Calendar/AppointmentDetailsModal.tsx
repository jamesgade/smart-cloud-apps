import React, { useState } from 'react';
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
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  VideoCall as VideoCallIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { Appointment } from './types';

interface AppointmentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment;
  userType: string;
  userId: string;
  onUpdate: () => void;
}

export const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  open,
  onClose,
  appointment,
  userType,
  userId,
  onUpdate,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [activeSession, setActiveSession] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(false);

  const isStudent = userType === 'Student';
  const isCounsellor = userType === 'Admin' || userType?.includes('Counsellor');
  const canConfirm = isCounsellor && appointment.status.status_code === 'PENDING';
  const canLaunchSession = isCounsellor && appointment.status.status_code === 'CONFIRMED' && !activeSession;
  const canJoinSession = isStudent && appointment.status.status_code === 'CONFIRMED' && activeSession;
  const canCancel = (isStudent || isCounsellor) && 
    ['PENDING', 'CONFIRMED'].includes(appointment.status.status_code);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api';

  // Check if session exists when modal opens
  React.useEffect(() => {
    if (open && appointment.status.status_code === 'CONFIRMED') {
      checkForActiveSession();
    }
  }, [open, appointment.appointment_id]);

  const checkForActiveSession = async () => {
    try {
      setCheckingSession(true);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      const response = await axios.get(
        `${API_BASE_URL}/sessions/appointment/${appointment.appointment_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setActiveSession(response.data);
    } catch (err: any) {
      // No session exists, that's fine
      setActiveSession(null);
    } finally {
      setCheckingSession(false);
    }
  };

  const getStatusColor = (statusCode: string) => {
    const colors: Record<string, string> = {
      PENDING: 'warning',
      CONFIRMED: 'success',
      REJECTED: 'error',
      CANCELLED: 'default',
      COMPLETED: 'info',
      NO_SHOW: 'default',
    };
    return colors[statusCode] || 'default';
  };

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');

      const response = await axios.patch(
        `${API_BASE_URL}/appointments/${appointment.appointment_id}/confirm`,
        { counsellor_notes: notes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Appointment confirmed successfully!');
      onClose(); // Close modal first
      onUpdate(); // Then refresh calendar
    } catch (err: any) {
      console.error('Error confirming appointment:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to confirm appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');

      await axios.patch(
        `${API_BASE_URL}/appointments/${appointment.appointment_id}/reject`,
        { rejection_reason: notes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdate();
      onClose();
    } catch (err: any) {
      console.error('Error rejecting appointment:', err);
      setError(err.response?.data?.message || 'Failed to reject appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');

      await axios.patch(
        `${API_BASE_URL}/appointments/${appointment.appointment_id}/cancel`,
        { cancellation_reason: notes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdate();
      onClose();
    } catch (err: any) {
      console.error('Error cancelling appointment:', err);
      setError(err.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLaunchSession = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');

      const response = await axios.post(
        `${API_BASE_URL}/sessions/launch`,
        { appointment_id: appointment.appointment_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect to video call page with session data
      const { session_id, counsellor_token } = response.data;
      window.open(`/video-call/${session_id}?token=${counsellor_token}`, '_blank');
      
      onUpdate();
      onClose();
    } catch (err: any) {
      console.error('Error launching session:', err);
      setError(err.response?.data?.message || 'Failed to launch video session');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinSession = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');

      // Get join token
      const response = await axios.get(
        `${API_BASE_URL}/sessions/${activeSession.sessionId}/join`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Open video call page with student token
      const { twilio_token } = response.data;
      window.open(`/video-call/${activeSession.sessionId}?token=${twilio_token}`, '_blank');
      
      onClose();
    } catch (err: any) {
      console.error('Error joining session:', err);
      setError(err.response?.data?.message || 'Failed to join video session');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Appointment Details
        <Chip
          label={appointment.status.status_name}
          color={getStatusColor(appointment.status.status_code) as any}
          size="small"
          sx={{ ml: 2 }}
        />
      </DialogTitle>
      
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Session Ready Alert for Students */}
        {isStudent && activeSession && (
          <Alert severity="success" sx={{ mb: 2 }} icon={<VideoCallIcon />}>
            <Typography variant="body2" fontWeight="bold">
              🎉 Video session is ready!
            </Typography>
            <Typography variant="caption">
              Your counsellor has launched the video session. Click "Join Video Session" below to enter the call.
            </Typography>
          </Alert>
        )}

        {/* Waiting for Session Alert for Students */}
        {isStudent && !activeSession && appointment.status.status_code === 'CONFIRMED' && !checkingSession && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              ⏳ Waiting for counsellor to launch the video session...
            </Typography>
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {appointment.title}
          </Typography>
          {appointment.description && (
            <Typography variant="body2" color="text.secondary">
              {appointment.description}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Date & Time */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarIcon sx={{ mr: 1, color: '#ff6b35' }} />
          <Typography>
            <strong>Date:</strong> {formatDate(appointment.appointment_date)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TimeIcon sx={{ mr: 1, color: '#ff6b35' }} />
          <Typography>
            <strong>Time:</strong> {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
          </Typography>
        </Box>

        {/* Student Info (for counsellors) */}
        {isCounsellor && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ mr: 1, color: '#ff6b35' }} />
            <Typography>
              <strong>Student:</strong> {appointment.student.first_name} {appointment.student.last_name}
              <br />
              <Typography variant="caption" color="text.secondary">
                {appointment.student.email}
              </Typography>
            </Typography>
          </Box>
        )}

        {/* Counsellor Info (for students) */}
        {isStudent && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ mr: 1, color: '#ff6b35' }} />
            <Typography>
              <strong>Counsellor:</strong> {appointment.counsellor.first_name} {appointment.counsellor.last_name}
              <br />
              <Typography variant="caption" color="text.secondary">
                {appointment.counsellor.email}
              </Typography>
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Notes Section */}
        {(canConfirm || canCancel) && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label={canConfirm ? "Add Notes (Optional)" : "Reason (Optional)"}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={canConfirm ? "Add any notes for this appointment" : "Why are you cancelling?"}
            sx={{ mb: 2 }}
          />
        )}

        {appointment.student_notes && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Student Notes:</Typography>
            <Typography variant="body2" color="text.secondary">
              {appointment.student_notes}
            </Typography>
          </Box>
        )}

        {appointment.counsellor_notes && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Counsellor Notes:</Typography>
            <Typography variant="body2" color="text.secondary">
              {appointment.counsellor_notes}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={submitting}>
          Close
        </Button>

        {/* Counsellor Actions */}
        {canConfirm && (
          <>
            <Button
              onClick={handleReject}
              color="error"
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={20} /> : 'Reject'}
            </Button>
            <Button
              onClick={handleConfirm}
              variant="contained"
              color="success"
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={20} /> : 'Confirm'}
            </Button>
          </>
        )}

        {/* Launch Video Session (Counsellor) */}
        {canLaunchSession && (
          <Button
            onClick={handleLaunchSession}
            variant="contained"
            startIcon={<VideoCallIcon />}
            disabled={submitting}
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
              },
            }}
          >
            {submitting ? <CircularProgress size={20} /> : 'Launch Video Session'}
          </Button>
        )}

        {/* Join Video Session (Student) */}
        {canJoinSession && (
          <Button
            onClick={handleJoinSession}
            variant="contained"
            startIcon={<VideoCallIcon />}
            disabled={submitting || checkingSession}
            sx={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #45a049 0%, #5da961 100%)',
              },
            }}
          >
            {submitting ? <CircularProgress size={20} /> : '🎥 Join Video Session'}
          </Button>
        )}

        {/* Cancel Appointment */}
        {canCancel && !canConfirm && (
          <Button
            onClick={handleCancel}
            color="error"
            variant="outlined"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={20} /> : 'Cancel Appointment'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentDetailsModal;

