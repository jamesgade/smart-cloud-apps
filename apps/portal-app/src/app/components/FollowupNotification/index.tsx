import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

interface Followup {
  followupId: string;
  studentId: string;
  followupType: string;
  followupDate: string;
  notes: string;
  status: string;
  nextFollowupDate?: string;
  student?: {
    firstName: string;
    lastName: string;
    mobilePhone: string;
  };
}

interface FollowupNotificationProps {
  open: boolean;
  followup: Followup | null;
  onClose: () => void;
  onViewStudent: (studentId: string) => void;
}

const FollowupNotification: React.FC<FollowupNotificationProps> = ({
  open,
  followup,
  onClose,
  onViewStudent,
}) => {
  if (!followup) return null;

  const studentName = followup.student
    ? `${followup.student.firstName} ${followup.student.lastName}`
    : 'Student';

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          border: '2px solid #ff6b35',
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon sx={{ color: '#ff6b35' }} />
            <Typography variant="h6">Followup Reminder</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PersonIcon sx={{ color: '#666', fontSize: 20 }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {studentName}
            </Typography>
            {followup.student?.mobilePhone && (
              <Typography variant="body2" color="text.secondary">
                ({followup.student.mobilePhone})
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Followup Type
              </Typography>
              <Chip
                label={followup.followupType}
                size="small"
                color={getFollowupTypeColor(followup.followupType) as any}
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <ScheduleIcon sx={{ color: '#666', fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary">
                  Scheduled Date & Time
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatDateTime(followup.followupDate)}
              </Typography>
            </Box>

            {followup.notes && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Notes
                </Typography>
                <Typography variant="body2">{followup.notes}</Typography>
              </Box>
            )}

            {followup.nextFollowupDate && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Next Followup
                </Typography>
                <Typography variant="body2">
                  {formatDateTime(followup.nextFollowupDate)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose}>Remind Me Later</Button>
        <Button
          onClick={() => {
            onClose(); // Close first
            // Small delay to ensure popup closes before navigation
            setTimeout(() => {
              onViewStudent(followup.studentId);
            }, 100);
          }}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
            },
          }}
        >
          View Student
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FollowupNotification;

