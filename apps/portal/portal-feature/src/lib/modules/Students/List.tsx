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
  TablePagination,
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import { School as SchoolIcon, Add as AddIcon, Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon, Assignment as AssignmentIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import { useGetIdentity, usePermissions } from '@refinedev/core';
import { API_BASE_URL } from '../../constants';
import CreateStudentModal from './Create';
import ViewStudentModal from './View';
import EditStudentModal from './Edit';
import AssignStudentsModal from './AssignStudents';

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  mobile_phone: string;
  state: string;
  city: string;
  referral_source?: string;
  created_at: string;
  updated_at: string;
  course_name: string;
  status?: string;
  assignment_assigned_to?: string;
  assignment_status?: string;
  assigned_to_first_name?: string;
  assigned_to_last_name?: string;
  assigned_to_email?: string;
}

const StudentsListPage: React.FC = () => {
  const { data: user, isLoading: userLoading } = useGetIdentity();
  const { data: permissions } = usePermissions({});
  
  // Helper function to check permissions with memoization
  const hasPermission = React.useMemo(() => {
    return (permission: string) => {
      return permissions?.data?.some((p: any) => p.actionName === permission) || false;
    };
  }, [permissions]);
  
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Check if user has permission to view students
  const canViewStudents = hasPermission('LEADS_MENU');
  
  // Check if user is Senior Counsellor or Counsellor
  const userRole = user?.roleName || user?.userTypeName || '';
  const isSeniorCounsellor = userRole?.toLowerCase() === 'senior counsellor';
  const isCounsellor = userRole?.toLowerCase() === 'counsellor';
  const isRestrictedRole = isSeniorCounsellor || isCounsellor;
  const canAssignStudents = !isRestrictedRole; // Only Admin and Manager can assign

  useEffect(() => {
    if (user && !userLoading) {
      if (canViewStudents) {
        fetchStudents();
      } else {
        setError('You do not have permission to view students');
        setLoading(false);
      }
    }
  }, [user, userLoading, canViewStudents]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      if (!token) {
        setError('No access token found');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/auth/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching students:', err);
      setError(err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('Are you sure you want to delete this student? This will set their status to INACTIVE.')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      if (!token) {
        setError('No access token found');
        return;
      }

      await axios.delete(`${API_BASE_URL}/auth/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchStudents();
    } catch (err: any) {
      console.error('Error deleting student:', err);
      setError(err.response?.data?.message || 'Failed to delete student');
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

  // Show loading while checking user permissions or fetching data
  if (userLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show permission denied error
  if (!canViewStudents) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access Denied: You do not have permission to view students. Required permission: LEADS_MENU
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Current user: {user?.userName || user?.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Role: {user?.roleName || user?.userTypeName}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Filter students based on role: Senior Counsellor and Counsellor only see assigned students
  // Note: This is a regular variable, not a hook, to avoid Rules of Hooks violation
  const roleFilteredStudents = (() => {
    if (!isRestrictedRole || !user?.userId) {
      return students;
    }
    // For Senior Counsellor and Counsellor, only show students assigned to them
    return students.filter((s) => {
      // Check if student is assigned to current user
      return s.assignment_assigned_to === user.userId;
    });
  })();

  const q = search.trim().toLowerCase();
  const filteredStudents = !q
    ? roleFilteredStudents
    : roleFilteredStudents.filter((s) => {
        const name = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase();
        const phone = (s.mobile_phone || '').toLowerCase();
        const state = (s.state || '').toLowerCase();
        const city = (s.city || '').toLowerCase();
        const referral = (s.referral_source || '').toLowerCase();
        const course = (s.course_name || '').toLowerCase();
        const assigned = `${s.assigned_to_first_name || ''} ${s.assigned_to_last_name || ''}`.toLowerCase();
        const assignedEmail = (s.assigned_to_email || '').toLowerCase();
        return (
          name.includes(q) ||
          phone.includes(q) ||
          state.includes(q) ||
          city.includes(q) ||
          referral.includes(q) ||
          course.includes(q) ||
          assigned.includes(q) ||
          assignedEmail.includes(q)
        );
      });

  const paginatedStudents = filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SchoolIcon sx={{ mr: 2, color: '#ff6b35' }} />
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#333' }}>
            Students Management
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'nowrap' }}>
          <TextField
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search by name, phone, state, city, course"
            size="small"
            sx={{ width: 280, maxWidth: '40vw' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          {canAssignStudents && (
            <Button
              variant="outlined"
              startIcon={<AssignmentIcon />}
              onClick={() => setAssignModalOpen(true)}
              sx={{
                borderColor: '#ff6b35',
                color: '#ff6b35',
                '&:hover': {
                  borderColor: '#e55a2b',
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                },
              }}
            >
              Assign Students
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
              },
            }}
          >
            Create Student
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600, overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>State</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>City</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Referral Source</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Assigned To</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Joined Date</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStudents.map((student, index) => (
                <TableRow key={`${student.student_id}-${index}-${student.mobile_phone}`} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {student.first_name} {student.last_name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{student.mobile_phone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{student.state || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{student.city || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{student.referral_source || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={student.course_name || 'No Course'}
                      size="small"
                      color={student.course_name ? 'primary' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {student.assigned_to_first_name ? (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {student.assigned_to_first_name} {student.assigned_to_last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {student.assigned_to_email}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not Assigned
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const s = (student.status || 'ACTIVE').toUpperCase();
                      return (
                        <Chip
                          label={s}
                          size="small"
                          color={s === 'ACTIVE' ? 'success' : 'warning'}
                          variant={s === 'ACTIVE' ? 'filled' : 'outlined'}
                        />
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(student.created_at)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedStudentId(student.student_id);
                          setViewModalOpen(true);
                        }}
                        title="View"
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedStudentId(student.student_id);
                          setEditModalOpen(true);
                        }}
                        title="Edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteStudent(student.student_id)}
                        title="Delete"
                        disabled={loading}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredStudents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {roleFilteredStudents.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {isRestrictedRole 
              ? 'No students assigned to you.' 
              : 'No students found.'}
          </Typography>
        </Box>
      )}

      <CreateStudentModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchStudents}
      />

      <ViewStudentModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedStudentId(null);
        }}
        studentId={selectedStudentId || ''}
        onEdit={() => {
          setViewModalOpen(false);
          setEditModalOpen(true);
        }}
      />

      <EditStudentModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedStudentId(null);
        }}
        studentId={selectedStudentId || ''}
        onSuccess={fetchStudents}
      />

      <AssignStudentsModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onSuccess={fetchStudents}
        students={students}
      />
    </Box>
  );
};

export default StudentsListPage;