import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';

interface Counsellor {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
}

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  mobile_phone: string;
}

interface AssignStudentsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  students: Student[];
}

const AssignStudentsModal: React.FC<AssignStudentsModalProps> = ({
  open,
  onClose,
  onSuccess,
  students,
}) => {
  const [selectedCounsellor, setSelectedCounsellor] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCounsellors, setFetchingCounsellors] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [studentsMenuOpen, setStudentsMenuOpen] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCounsellors();
    }
  }, [open]);

  const fetchCounsellors = async () => {
    try {
      setFetchingCounsellors(true);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      if (!token) {
        setError('No access token found');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/student-assignments/counsellors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter to show only Counsellors and Senior Counsellors
      const allCounsellors = response.data || [];
      const filteredCounsellors = allCounsellors.filter((counsellor: Counsellor) => {
        const roleName = (counsellor.roleName || '').toLowerCase();
        return roleName === 'counsellor' || roleName === 'senior counsellor';
      });

      setCounsellors(filteredCounsellors);
    } catch (err: any) {
      console.error('Error fetching counsellors:', err);
      setError(err.response?.data?.message || 'Failed to fetch counsellors');
    } finally {
      setFetchingCounsellors(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCounsellor || selectedStudents.length === 0) {
      setError('Please select a counsellor and at least one student');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      if (!token) {
        setError('No access token found');
        return;
      }

      await axios.post(
        `${API_BASE_URL}/student-assignments`,
        {
          studentIds: selectedStudents,
          assignedToUserId: selectedCounsellor,
          notes: notes || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form
      setSelectedCounsellor('');
      setSelectedStudents([]);
      setNotes('');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error assigning students:', err);
      setError(err.response?.data?.message || 'Failed to assign students');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedCounsellor('');
    setSelectedStudents([]);
    setNotes('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon sx={{ color: '#ff6b35' }} />
          <Typography variant="h6">Assign Students</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth>
            <InputLabel>Select Counsellor</InputLabel>
            <Select
              value={selectedCounsellor}
              onChange={(e) => setSelectedCounsellor(e.target.value)}
              label="Select Counsellor"
              disabled={fetchingCounsellors}
            >
              {fetchingCounsellors ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading...
                </MenuItem>
              ) : (
                counsellors.map((counsellor) => (
                  <MenuItem key={counsellor.userId} value={counsellor.userId}>
                    <Box>
                      <Typography variant="body1">
                        {counsellor.firstName} {counsellor.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {counsellor.email} ({counsellor.roleName})
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Select Students</InputLabel>
            <Select
              multiple
              value={selectedStudents}
              onChange={(e) => setSelectedStudents(e.target.value as string[])}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((studentId) => {
                    const student = students.find((s) => s.student_id === studentId);
                    return student ? (
                      <Chip
                        key={studentId}
                        label={`${student.first_name} ${student.last_name}`}
                        size="small"
                      />
                    ) : null;
                  })}
                </Box>
              )}
              label="Select Students"
              open={studentsMenuOpen}
              onOpen={() => setStudentsMenuOpen(true)}
              onClose={() => setStudentsMenuOpen(false)}
            >
              <MenuItem
                divider
                onClick={(e) => e.stopPropagation()}
                disableRipple
                disableTouchRipple
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  bgcolor: 'background.paper',
                  borderBottom: '1px solid #eee',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%', justifyContent: 'flex-start' }}>
                  <Button size="small" onClick={(e) => { e.stopPropagation(); setSelectedStudents(students.map((s)=>s.student_id)); }}>Select all</Button>
                  <Button size="small" onClick={(e) => { e.stopPropagation(); setSelectedStudents([]); }}>Cancel all</Button>
                  <Box sx={{ flex: 1 }} />
                  <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); setStudentsMenuOpen(false); }}>OK</Button>
                </Box>
              </MenuItem>
              {students.map((student) => (
                <MenuItem key={student.student_id} value={student.student_id}>
                  <Checkbox checked={selectedStudents.indexOf(student.student_id) > -1} />
                  <ListItemText
                    primary={`${student.first_name} ${student.last_name}`}
                    secondary={student.mobile_phone}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Notes (Optional)"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this assignment..."
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <PersonIcon sx={{ color: '#666' }} />
            <Typography variant="body2" color="text.secondary">
              {selectedStudents.length} student(s) selected
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !selectedCounsellor || selectedStudents.length === 0}
          sx={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
            },
          }}
        >
          {loading ? <CircularProgress size={20} /> : 'Assign Students'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignStudentsModal;

