import React from 'react';
import { useList, usePermissions, useUpdate, useGetIdentity } from '@refinedev/core';
import CreateCollegeModal from './Create';
import EditCollegeModal from './Edit';
import ViewDetails from './ViewDetails';
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  TablePagination,
  Avatar,
  Rating,
  Pagination,
  Stack,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

interface College {
  collegeId: string;
  name: string;
  type: string;
  program: string;
  state: string;
  district?: string;
  city?: string;
  fees?: string;
  image?: string;
  rating?: number;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  establishedYear?: number;
  affiliation?: string;
  accreditation?: string;
  isActive: boolean;
  // New enhanced fields
  coursesOffered?: string[];
  entranceExams?: string[];
  cutoffPercentile?: number;
  applicationDeadline?: string;
  minimumPercentage?: number;
  tuitionFeeYearly?: number;
  hostelFeeYearly?: number;
  totalFeeYearly?: number;
  scholarshipsAvailable?: boolean;
  loanFacilities?: boolean;
  campusSizeAcres?: number;
  hostelFacility?: boolean;
  libraryBooksCount?: number;
  laboratoriesCount?: number;
  wifiFacility?: boolean;
  totalStudents?: number;
  facultyCount?: number;
  placementPercentage?: number;
  averageSalary?: number;
  topRecruiters?: string[];
}

export const CollegeList: React.FC = () => {
  const { mutate: updateCollege } = useUpdate();
  const { data: permissions } = usePermissions({});
  const { data: user } = useGetIdentity();
  
  // Helper function to check permissions with memoization
  const hasPermission = React.useMemo(() => {
    return (permission: string) => {
      return permissions?.data?.some((p: any) => p.actionName === permission) || false;
    };
  }, [permissions]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedCollegeId, setSelectedCollegeId] = React.useState<
    string | null
  >(null);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  // Check if user is a student
  const isStudent = user?.userTypeName?.toLowerCase() === 'student' || user?.roleName?.toLowerCase() === 'student';
  
  const { query } = useList<College>({
    resource: 'colleges',
    filters: [
      ...(searchTerm ? [{
        field: 'name',
        operator: '$cont',
        value: searchTerm,
      }] : []),
    ],
    pagination: {
      current: page + 1,
      pageSize: rowsPerPage,
    },
    queryOptions: {
      queryKey: ['colleges-list', page, rowsPerPage, searchTerm],
      enabled: true,
    },
  });

  const rawData = query?.data?.data?.data || [];
  const isLoading = query?.isLoading;
  const total = query?.data?.data?.total || query?.data?.total || 0;
  const pageCount = query?.data?.data?.pageCount || Math.ceil(total / rowsPerPage);
  
  // Client-side filtering as backup to ensure inactive colleges are hidden from students
  const data = isStudent 
    ? rawData.filter((college: College) => college.isActive === true)
    : rawData;
  const collegeTypes = [
    'Engineering',
    'Medical',
    'Arts',
    'Science',
    'Commerce',
    'Law',
    'Agriculture',
    'Management',
    'Pharmacy',
    'Architecture',
    'Education',
    'Other',
  ];

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Puducherry',
  ];
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleCreateSuccess = () => {
    query?.refetch?.();
  };

  const handleEditSuccess = () => {
    query?.refetch?.();
    setEditModalOpen(false);
    setSelectedCollegeId(null);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    collegeId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedCollegeId(collegeId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCollegeId(null);
  };

  const handleEdit = () => {
    if (selectedCollegeId) {
      setEditModalOpen(true);
    }
    setAnchorEl(null); // Close menu but keep selectedCollegeId
  };

  const handleView = () => {
    if (selectedCollegeId) {
      setViewDetailsOpen(true);
    }
    setAnchorEl(null); // Close menu but keep selectedCollegeId
  };

  const handleViewDetails = (collegeId: string) => {
    setSelectedCollegeId(collegeId);
    setViewDetailsOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setAnchorEl(null); // Close menu but keep selectedCollegeId
  };

  const handleDeleteConfirm = () => {
    if (selectedCollegeId) {
      // Soft delete - set is_active to false instead of actually deleting
      updateCollege(
        {
          resource: 'colleges',
          id: selectedCollegeId,
          values: { isActive: false },
        },
        {
          onSuccess: () => {
            setDeleteDialogOpen(false);
            setSelectedCollegeId(null);
          },
          onError: (error) => {
            console.error('Failed to deactivate college:', error);
          },
        }
      );
    } else {
      console.error('No selectedCollegeId available for deletion');
    }
  };

  const selectedCollege = data.find((college: College) => college.collegeId === selectedCollegeId);
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Create Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Colleges Management
        </Typography>
        {hasPermission('CREATE_COLLEGE') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            sx={{
              backgroundColor: '#ff6b35',
              '&:hover': {
                backgroundColor: '#e55a2b',
              },
            }}
          >
            Add College
          </Button>
        )}
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search colleges by name, location, or program..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0); // Reset to first page on search
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>College</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Program</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  {/* Show View Details column for students */}
                  {isStudent && (
                    <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
                      View Details
                    </TableCell>
                  )}
                  {/* Show Actions column only if user has edit or delete permissions */}
                  {(hasPermission('EDIT_COLLEGE') || hasPermission('DELETE_COLLEGE')) && (
                    <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={
                      (hasPermission('EDIT_COLLEGE') || hasPermission('DELETE_COLLEGE')) 
                        ? 6 
                        : isStudent 
                          ? 6 
                          : 5
                    } sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={
                      (hasPermission('EDIT_COLLEGE') || hasPermission('DELETE_COLLEGE')) 
                        ? 6 
                        : isStudent 
                          ? 6 
                          : 5
                    } sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">
                        No colleges found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((college: College) => (
                    <TableRow key={college.collegeId} hover>
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                        >
                          {/* <Avatar
                            src={college.image}
                            sx={{ width: 40, height: 40, backgroundColor: '#ff6b35' }}
                          >
                            <SchoolIcon />
                          </Avatar> */}
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              fontWeight={600}
                              sx={{ 
                                cursor: 'pointer',
                                '&:hover': { 
                                  color: 'primary.main',
                                  textDecoration: 'underline' 
                                }
                              }}
                              onClick={() => handleViewDetails(college.collegeId)}
                            >
                              {college.name}
                            </Typography>
                            {college.establishedYear && (
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Est. {college.establishedYear}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={college.type} size="small" />
                      </TableCell>
                        <TableCell>
                        <Chip label={college.program} size="small" />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {college.city ? `${college.city}, ` : ''}
                            {college.state}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {college.rating && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <Rating
                              value={college.rating}
                              readOnly
                              size="small"
                            />
                            {/* <Typography variant="body2">({college.rating})</Typography> */}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={college.isActive ? 'Active' : 'Inactive'}
                          color={college.isActive ? 'success' : 'default'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      {/* Show View Details button for students */}
                      {isStudent && (
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ViewIcon />}
                            onClick={() => handleViewDetails(college.collegeId)}
                            sx={{
                              textTransform: 'none',
                              fontSize: '0.75rem',
                              py: 0.5,
                              px: 1.5,
                            }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      )}
                      {/* Show actions column only if user has edit or delete permissions */}
                      {(hasPermission('EDIT_COLLEGE') || hasPermission('DELETE_COLLEGE')) && (
                        <TableCell sx={{ textAlign: 'center' }}>
                          <IconButton
                            onClick={(event) =>
                              handleMenuClick(event, college.collegeId)
                            }
                            size="small"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ 
            borderTop: '1px solid #e0e0e0', 
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body2" color="text.secondary">
              Showing {((page) * rowsPerPage) + 1}-{Math.min((page + 1) * rowsPerPage, total)} of {total} results
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center">
              {total > 0 && (
                <Pagination
                  count={pageCount}
                  page={page + 1}
                  onChange={(event, value) => handleChangePage(event, value - 1)}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#666',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#ff6b35',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#e55a2b',
                        },
                      },
                    },
                  }}
                />
              )}
            </Stack>
          </Box>
          {/* Pagination */}
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleView} sx={{ gap: 1 }}>
          <ViewIcon fontSize="small" />
          View
        </MenuItem>
        {hasPermission('EDIT_COLLEGE') && (
          <MenuItem onClick={handleEdit} sx={{ gap: 1 }}>
            <EditIcon fontSize="small" />
            Edit
          </MenuItem>
        )}
        {hasPermission('DELETE_COLLEGE') && (
          <MenuItem
            onClick={handleDeleteClick}
            sx={{ gap: 1, color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" />
            Deactivate
          </MenuItem>
        )}
      </Menu>

      {/* Create College Modal */}
      <CreateCollegeModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit College Modal */}
      <EditCollegeModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedCollegeId(null);
        }}
        onSuccess={handleEditSuccess}
        college={selectedCollege}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Deactivate College</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to deactivate this college? It will be hidden from students but can be reactivated later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Modal */}
      <ViewDetails
        open={viewDetailsOpen}
        onClose={() => {
          setViewDetailsOpen(false);
          setSelectedCollegeId(null);
        }}
        college={selectedCollege}
      />
    </Box>
  );
};

export default CollegeList;
