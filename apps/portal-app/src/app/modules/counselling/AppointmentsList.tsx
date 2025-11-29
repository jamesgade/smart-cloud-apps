import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Button,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Search as SearchIcon,
  VideoCall as VideoCallIcon,
  CheckCircle as ConfirmIcon,
  Cancel as RejectIcon,
  PlayCircleOutline as PlayVideoIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useGetIdentity } from '@refinedev/core';

interface Appointment {
  appointment_id: string;
  student_id: string;
  counsellor_id: string;
  title: string;
  description: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  student_notes: string;
  counsellor_notes: string;
  session_id?: string;
  status: {
    status_code: string;
    status_name: string;
  };
  student: {
    first_name: string;
    last_name: string;
    email: string;
  };
  counsellor: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const AppointmentsList: React.FC = () => {
  const { data: user } = useGetIdentity();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [videoDialog, setVideoDialog] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<any>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api';
  const isAdmin = user?.userTypeName === 'Admin';

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchQuery]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      const response = await axios.get(`${API_BASE_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    if (!searchQuery) {
      setFilteredAppointments(appointments);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = appointments.filter(apt => 
      apt.title.toLowerCase().includes(query) ||
      apt.student.first_name.toLowerCase().includes(query) ||
      apt.student.last_name.toLowerCase().includes(query) ||
      apt.counsellor.first_name.toLowerCase().includes(query) ||
      apt.counsellor.last_name.toLowerCase().includes(query) ||
      apt.status.status_name.toLowerCase().includes(query)
    );
    setFilteredAppointments(filtered);
  };

  const getStatusColor = (statusCode: string) => {
    const colors: Record<string, 'warning' | 'success' | 'error' | 'default' | 'info'> = {
      PENDING: 'warning',
      CONFIRMED: 'success',
      REJECTED: 'error',
      CANCELLED: 'default',
      COMPLETED: 'info',
      NO_SHOW: 'default',
    };
    return colors[statusCode] || 'default';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePlayVideo = async (appointmentId: string) => {
    try {
      setLoadingVideo(true);
      setVideoError(null);
      setVideoDialog(true);
      setSelectedRecording(null);
      
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      // Create an authenticated blob URL for video playback
      const response = await fetch(
        `${API_BASE_URL}/sessions/appointment/${appointmentId}/recording/stream`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const videoUrl = window.URL.createObjectURL(blob);
      
      setSelectedRecording({
        success: true,
        downloadUrl: videoUrl,
        filename: `session-recording-${appointmentId}.webm`,
        recordingDetails: {
          appointmentId: appointmentId,
          format: 'WebM',
          size: blob.size
        }
      });
      
    } catch (err: any) {
      console.error('Error getting recording info:', err);
      setVideoError(err.message || 'Failed to load video recording');
    } finally {
      setLoadingVideo(false);
    }
  };

  const handleCloseVideoDialog = () => {
    setVideoDialog(false);
    
    // Clean up object URL if it exists
    if (selectedRecording && selectedRecording.downloadUrl && selectedRecording.downloadUrl.startsWith('blob:')) {
      window.URL.revokeObjectURL(selectedRecording.downloadUrl);
    }
    
    setSelectedRecording(null);
    setVideoError(null);
  };

  const handleDownloadVideo = async (appointmentId: string) => {
    try {
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      // Use fetch with proper headers to get the video stream
      const response = await fetch(
        `${API_BASE_URL}/sessions/appointment/${appointmentId}/recording/stream`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob data
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `session-recording-${appointmentId}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
      
    } catch (err: any) {
      console.error('Error downloading recording:', err);
      alert('Failed to download recording. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  const paginatedAppointments = filteredAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Counselling Appointments
            </Typography>
            <Chip 
              label={isAdmin ? 'Viewing All Appointments' : 'My Appointments'} 
              color={isAdmin ? 'primary' : 'secondary'}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search by student, counsellor, title, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {/* Appointments Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Time</strong></TableCell>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell><strong>Counsellor</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary" sx={{ py: 3 }}>
                        {searchQuery ? 'No appointments found matching your search' : 'No appointments found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAppointments.map((apt) => (
                    <TableRow key={apt.appointment_id} hover>
                      <TableCell>{formatDate(apt.appointment_date)}</TableCell>
                      <TableCell>
                        {formatTime(apt.start_time)} - {formatTime(apt.end_time)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {apt.title}
                        </Typography>
                        {apt.description && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {apt.description.substring(0, 50)}...
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {apt.student.first_name} {apt.student.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {apt.student.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {apt.counsellor.first_name} {apt.counsellor.last_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={apt.status.status_name}
                          color={getStatusColor(apt.status.status_code)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          color="primary"
                          title="View Details"
                        >
                          <ViewIcon />
                        </IconButton>
                        {apt.status.status_code === 'CONFIRMED' && (
                          <IconButton 
                            size="small" 
                            sx={{ color: '#FF6B35' }}
                            title="Launch Session"
                          >
                            <VideoCallIcon />
                          </IconButton>
                        )}
                        {apt.status.status_code === 'COMPLETED' && (
                          <>
                            <IconButton 
                              size="small" 
                              sx={{ color: '#4CAF50' }}
                              title="Play Recording"
                              onClick={() => handlePlayVideo(apt.appointment_id)}
                            >
                              <PlayVideoIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ color: '#2196F3' }}
                              title="Download Recording"
                              onClick={() => handleDownloadVideo(apt.appointment_id)}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredAppointments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          {/* Statistics */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`Total: ${appointments.length}`}
              variant="outlined"
            />
            <Chip 
              label={`Pending: ${appointments.filter(a => a.status.status_code === 'PENDING').length}`}
              color="warning"
              variant="outlined"
            />
            <Chip 
              label={`Confirmed: ${appointments.filter(a => a.status.status_code === 'CONFIRMED').length}`}
              color="success"
              variant="outlined"
            />
            <Chip 
              label={`Completed: ${appointments.filter(a => a.status.status_code === 'COMPLETED').length}`}
              color="info"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Video Recording Dialog */}
      <Dialog 
        open={videoDialog} 
        onClose={handleCloseVideoDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '80vh' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Session Recording</Typography>
          <IconButton onClick={handleCloseVideoDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          {loadingVideo && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading video recording...</Typography>
            </Box>
          )}
          
          {videoError && (
            <Box sx={{ p: 3 }}>
              <Alert severity="error">{videoError}</Alert>
            </Box>
          )}
          
          {selectedRecording && !loadingVideo && !videoError && (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
              {/* Recording Info */}
              <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  📹 Recording Details
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Format: {selectedRecording.recordingDetails?.format || 'WebM'}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Duration: {selectedRecording.recordingDetails?.duration || 'N/A'} seconds
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Size: {selectedRecording.recordingDetails?.size ? `${Math.round(selectedRecording.recordingDetails.size / 1024 / 1024)} MB` : 'N/A'}
                </Typography>
              </Box>
              
              {/* Twilio Video Player */}
              <Box sx={{ flex: 1, backgroundColor: '#000', borderRadius: 1, overflow: 'hidden' }}>
                <video
                  ref={videoRef}
                  src={selectedRecording.downloadUrl}
                  controls
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '400px',
                  }}
                  preload="metadata"
                  onLoadStart={() => console.log('Twilio video load started')}
                  onCanPlay={() => console.log('Twilio video can play')}
                  onLoadedMetadata={() => console.log('Twilio video metadata loaded')}
                  onError={(e) => {
                    console.error('Twilio video error:', e);
                    const video = e.target as HTMLVideoElement;
                    console.error('Video error details:', {
                      error: video.error,
                      networkState: video.networkState,
                      readyState: video.readyState,
                      src: video.src
                    });
                    
                    const errorCode = video.error?.code;
                    let errorMessage = 'Unknown video error';
                    
                    switch (errorCode) {
                      case 1:
                        errorMessage = 'Video playback was aborted';
                        break;
                      case 2:
                        errorMessage = 'Network error loading video';
                        break;
                      case 3:
                        errorMessage = 'Video decode error';
                        break;
                      case 4:
                        errorMessage = 'Video format not supported';
                        break;
                    }
                    
                    setVideoError(`Playback error: ${errorMessage}`);
                  }}
                  onPlay={() => console.log('Twilio video playing')}
                  onPause={() => console.log('Twilio video paused')}
                >
                  Your browser does not support video playback.
                </video>
              </Box>
              
              {/* Download Option */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedRecording.downloadUrl;
                    link.download = selectedRecording.filename || 'session-recording.webm';
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  📥 Download Video
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVideoDialog} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentsList;

