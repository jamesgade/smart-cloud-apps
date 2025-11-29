import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  IconButton,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useGetIdentity } from '@refinedev/core';

interface ProfilePopupProps {
  open: boolean;
  onClose: () => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ open, onClose }) => {
  const { data: user, isLoading: isUserLoading } = useGetIdentity();

  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(" ");
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  // Helper function to get email from username field
  const getUserEmail = () => {
    if (!user) return 'Not provided';
    
    // Use userName as email
    return user.userName || 'Not provided';
  };

  const getUserTypeColor = (userType?: string) => {
    switch (userType?.toLowerCase()) {
      case 'student':
        return 'primary';
      case 'admin':
        return 'error';
      case 'counsellor':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (isUserLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Loading profile...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!user) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Alert severity="error">
            Unable to load user profile. Please try again.
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            My Profile
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {/* Profile Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: '#ff6b35',
              color: '#fff',
              fontSize: '2rem',
              mr: 3,
            }}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              user.userName ? getInitials(user.userName) : <PersonIcon />
            )}
          </Avatar>
          <Box>
            <Typography variant="h5" gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>
            <Box display="flex" gap={1} alignItems="center" mb={1}>
              <Chip
                icon={<SecurityIcon />}
                label={user.userTypeName || user.roleName || 'User'}
                color={getUserTypeColor(user.userTypeName || user.roleName)}
                size="small"
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Profile Fields */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                First Name
              </Typography>
              <Typography variant="body1">
                {user.firstName || 'Not provided'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Last Name
              </Typography>
              <Typography variant="body1">
                {user.lastName || 'Not provided'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Email Address
              </Typography>
              <Typography variant="body1">
                {user.username}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Username
              </Typography>
              <Typography variant="body1">
                {getUserEmail()}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                User Role
              </Typography>
              <Typography variant="body1">
                {user.roleName}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfilePopup;
