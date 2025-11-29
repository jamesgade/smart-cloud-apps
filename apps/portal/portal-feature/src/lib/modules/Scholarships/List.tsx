import React from 'react';
import { useTable, useNavigation, usePermissions } from '@refinedev/core';
import CreateScholarshipModal from './Create';
import EditScholarshipModal from './Edit';
import ViewScholarshipModal from './View';
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
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as InterestIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

interface Scholarship {
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  eligibilityCriteria?: string;
  applicableCourses?: string;
  educationLevel?: string;
  scholarshipAmount?: number;
  benefitsDescription?: string;
  applicationProcess?: string;
  portalLink?: string;
  applicationStartDate?: string;
  applicationEndDate?: string;
  renewalSchedule?: string;
  overallRemarks?: string;
  isActive: boolean;
}

export const ScholarshipList: React.FC = () => {
  const { show } = useNavigation();
  const { data: permissions } = usePermissions({});
  
  // Helper function to check permissions with memoization
  const hasPermission = React.useMemo(() => {
    return (permission: string) => {
      return permissions?.data?.some((p: any) => p.actionName === permission) || false;
    };
  }, [permissions]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedScholarshipId, setSelectedScholarshipId] = React.useState<string | null>(null);
  const [selectedScholarshipData, setSelectedScholarshipData] = React.useState<Scholarship | null>(null);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  const { tableQuery, setCurrentPage, currentPage, setPageSize, pageCount, pageSize } = useTable<Scholarship>({
    resource: 'scholarships',
    pagination: {
      current: page + 1,
      pageSize: rowsPerPage,
      mode: 'server',
    },
    syncWithLocation: false,
  });

  const isLoading = tableQuery.isLoading;
  const data = Array.isArray(tableQuery.data?.data?.data) ? tableQuery.data.data?.data : [];
  const total = tableQuery.data?.total || 0;

  const handleChangePage = React.useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleCreateSuccess = React.useCallback(() => {
    tableQuery.refetch();
  }, [tableQuery]);

  const handleEditSuccess = React.useCallback(() => {
    setEditModalOpen(false);
    setSelectedScholarshipData(null);
    tableQuery.refetch();
  }, [tableQuery]);

  const handleMenuClick = React.useCallback((event: React.MouseEvent<HTMLElement>, scholarshipId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedScholarshipId(scholarshipId);
  }, []);

  const handleMenuClose = React.useCallback(() => {
    setAnchorEl(null);
    setSelectedScholarshipId(null);
  }, []);

  const handleEdit = React.useCallback(() => {
    // Find the selected scholarship directly here to avoid circular dependency
    const currentSelectedScholarship = data.find((scholarship: Scholarship) => scholarship.scholarshipId === selectedScholarshipId);
    
    if (selectedScholarshipId && currentSelectedScholarship) {
      // Store the scholarship data in state to ensure it's available when modal opens
      setSelectedScholarshipData(currentSelectedScholarship);
      setEditModalOpen(true);
    }
    handleMenuClose();
  }, [selectedScholarshipId, data, handleMenuClose]);

  const handleView = React.useCallback(() => {
    // Find the selected scholarship directly here to avoid circular dependency
    const currentSelectedScholarship = data.find((scholarship: Scholarship) => scholarship.scholarshipId === selectedScholarshipId);
    
    if (selectedScholarshipId && currentSelectedScholarship) {
      // Store the scholarship data in state to ensure it's available when modal opens
      setSelectedScholarshipData(currentSelectedScholarship);
      setViewModalOpen(true);
    }
    handleMenuClose();
  }, [selectedScholarshipId, data, handleMenuClose]);

  // Memoize expensive calculations
  const selectedScholarship = React.useMemo(() => {
    if (!selectedScholarshipId || !data || data.length === 0) return undefined;
    return data.find((scholarship: Scholarship) => scholarship.scholarshipId === selectedScholarshipId);
  }, [data, selectedScholarshipId]);

  const formatCurrency = React.useCallback((amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  const formatAmountRange = React.useCallback((amount?: number) => {
    if (amount) {
      return formatCurrency(amount);
    }
    return 'Not specified';
  }, [formatCurrency]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Scholarships Management
        </Typography>
        {hasPermission('CREATE_SCHOLARSHIP') && (
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
            Add Scholarship
          </Button>
        )}
      </Box>

      {/* Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Scholarship Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Provider</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Level</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">
                        No scholarships found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((scholarship: Scholarship) => (
                    <TableRow key={scholarship.scholarshipId} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SchoolIcon fontSize="small" color="action" />
                          <Typography variant="subtitle2" fontWeight={600}>
                            {scholarship.scholarshipName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {scholarship.provider}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <MoneyIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {formatAmountRange(scholarship.scholarshipAmount)}
                          </Typography>
                        </Box>
                        {scholarship.benefitsDescription && (
                          <Tooltip title={scholarship.benefitsDescription} arrow>
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5, cursor: 'help' }}>
                              Benefits: {scholarship.benefitsDescription.substring(0, 30)}...
                            </Typography>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={scholarship.educationLevel || 'Not specified'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        {scholarship.applicableCourses && (
                          <Tooltip title={scholarship.applicableCourses} arrow>
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5, cursor: 'help' }}>
                              Courses: {scholarship.applicableCourses.substring(0, 30)}...
                            </Typography>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={scholarship.isActive ? 'Active' : 'Inactive'}
                          color={scholarship.isActive ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            fontWeight: 600,
                            color: scholarship.isActive ? 'success.main' : 'error.main',
                            borderColor: scholarship.isActive ? 'success.main' : 'error.main',
                            '&:hover': {
                              backgroundColor: scholarship.isActive ? 'success.light' : 'error.light',
                            }
                          }}
                        />
                        {scholarship.overallRemarks && (
                          <Tooltip title={scholarship.overallRemarks} arrow>
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5, cursor: 'help' }}>
                              Remarks: {scholarship.overallRemarks.substring(0, 30)}...
                            </Typography>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <IconButton
                          onClick={(event) => handleMenuClick(event, scholarship.scholarshipId)}
                          size="small"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: '1px solid #e0e0e0',
              '.MuiTablePagination-toolbar': {
                paddingLeft: 2,
                paddingRight: 2,
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleView} sx={{ gap: 1 }}>
          <ViewIcon fontSize="small" />
          View
        </MenuItem>
        {hasPermission('UPDATE_SCHOLARSHIP') && (
          <MenuItem onClick={handleEdit} sx={{ gap: 1 }}>
            <EditIcon fontSize="small" />
            Edit
          </MenuItem>
        )}
      </Menu>

      {/* Create Scholarship Modal */}
      <CreateScholarshipModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Scholarship Modal */}
      <EditScholarshipModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedScholarshipData(null);
        }}
        onSuccess={handleEditSuccess}
        scholarship={selectedScholarshipData || undefined}
      />

      {/* View Scholarship Modal */}
      <ViewScholarshipModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedScholarshipData(null);
        }}
        scholarship={selectedScholarshipData || undefined}
      />
    </Box>
  );
};

export default ScholarshipList;
