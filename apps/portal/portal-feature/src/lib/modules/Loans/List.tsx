import React from 'react';
import { useTable, useNavigation, usePermissions } from '@refinedev/core';
import CreateLoanModal from './Create';
import EditLoanModal from './Edit';
import ViewLoanModal from './View';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  AccountBalance as BankIcon,
  TrendingUp as InterestIcon,
  Security as CollateralIcon,
  Person as GuarantorIcon,
} from '@mui/icons-material';

interface Loan {
  loanId: string;
  bankName: string;
  loanAmountMin?: number;
  loanAmountMax?: number;
  coverageDetails?: string;
  interestRate?: number;
  interestType: string;
  moratoriumPeriodMonths?: number;
  repaymentDurationMonths?: number;
  eligibilityCriteria?: string;
  collateralRequired: boolean;
  collateralThresholdAmount?: number;
  guarantorRequired: boolean;
  overallRemarks?: string;
  isActive: boolean;
}

export const LoanList: React.FC = () => {
  const { show } = useNavigation();
  const { data: permissions } = usePermissions({});
  
  // Helper function to check permissions with memoization
  const hasPermission = React.useMemo(() => {
    return (permission: string) => {
      return permissions?.data?.some((p: any) => p.actionName === permission) || false;
    };
  }, [permissions]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedLoanId, setSelectedLoanId] = React.useState<string | null>(null);
  const [selectedLoanData, setSelectedLoanData] = React.useState<Loan | null>(null);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  const { tableQuery, setCurrentPage, currentPage, setPageSize, pageCount, pageSize } = useTable<Loan>({
    resource: 'loans',
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
    setSelectedLoanData(null);
    tableQuery.refetch();
  }, [tableQuery]);

  const handleMenuClick = React.useCallback((event: React.MouseEvent<HTMLElement>, loanId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedLoanId(loanId);
  }, []);

  const handleMenuClose = React.useCallback(() => {
    setAnchorEl(null);
    setSelectedLoanId(null);
  }, []);

  const handleEdit = React.useCallback(() => {
    // Find the selected loan directly here to avoid circular dependency
    const currentSelectedLoan = data.find((loan: Loan) => loan.loanId === selectedLoanId);
    
    if (selectedLoanId && currentSelectedLoan) {
      // Store the loan data in state to ensure it's available when modal opens
      setSelectedLoanData(currentSelectedLoan);
      setEditModalOpen(true);
    }
    handleMenuClose();
  }, [handleMenuClose, selectedLoanId, data]);

  const handleView = React.useCallback(() => {
    // Find the selected loan directly here to avoid circular dependency
    const currentSelectedLoan = data.find((loan: Loan) => loan.loanId === selectedLoanId);
    
    if (selectedLoanId && currentSelectedLoan) {
      // Store the loan data in state to ensure it's available when modal opens
      setSelectedLoanData(currentSelectedLoan);
      setViewModalOpen(true);
    }
    handleMenuClose();
  }, [selectedLoanId, data, handleMenuClose]);


  // Memoize expensive calculations
  const selectedLoan = React.useMemo(() => {
    if (!selectedLoanId || !data || data.length === 0) return undefined;
    return data.find((loan: Loan) => loan.loanId === selectedLoanId);
  }, [data, selectedLoanId]);

  const formatCurrency = React.useCallback((amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  const formatAmountRange = React.useCallback((min?: number, max?: number) => {
    if (min && max) {
      return `${formatCurrency(min)} - ${formatCurrency(max)}`;
    } else if (min) {
      return `From ${formatCurrency(min)}`;
    } else if (max) {
      return `Up to ${formatCurrency(max)}`;
    }
    return 'Not specified';
  }, [formatCurrency]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Loans Management
        </Typography>
        {hasPermission('CREATE_LOAN') && (
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
            Add Loan
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
                  <TableCell sx={{ fontWeight: 600 }}>Bank</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Loan Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Interest Rate</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Requirements</TableCell>
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
                      <Typography color="text.secondary">No loans found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((loan: Loan) => (
                    <TableRow key={loan.loanId} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <BankIcon color="primary" />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {loan.bankName}
                            </Typography>
                            {loan.interestType && (
                              <Typography variant="caption" color="textSecondary">
                                {loan.interestType} Interest
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatAmountRange(loan.loanAmountMin, loan.loanAmountMax)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <InterestIcon fontSize="small" color="success" />
                          <Typography variant="body2" fontWeight={600}>
                            {loan.interestRate}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {loan.collateralRequired && (
                            <Tooltip title="Collateral Required">
                              <Chip
                                icon={<CollateralIcon />}
                                label="Collateral"
                                size="small"
                                color="warning"
                                variant="outlined"
                              />
                            </Tooltip>
                          )}
                          {loan.guarantorRequired && (
                            <Tooltip title="Guarantor Required">
                              <Chip
                                icon={<GuarantorIcon />}
                                label="Guarantor"
                                size="small"
                                color="info"
                                variant="outlined"
                              />
                            </Tooltip>
                          )}
                          {!loan.collateralRequired && !loan.guarantorRequired && (
                            <Chip label="No Requirements" size="small" color="success" variant="outlined" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={loan.isActive ? 'Active' : 'Inactive'}
                          color={loan.isActive ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            fontWeight: 600,
                            color: loan.isActive ? 'success.main' : 'error.main',
                            borderColor: loan.isActive ? 'success.main' : 'error.main',
                            '&:hover': {
                              backgroundColor: loan.isActive ? 'success.light' : 'error.light',
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <IconButton
                          onClick={(event) => handleMenuClick(event, loan.loanId)}
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
        {hasPermission('UPDATE_LOAN') && (
          <MenuItem onClick={handleEdit} sx={{ gap: 1 }}>
            <EditIcon fontSize="small" />
            Edit
          </MenuItem>
        )}
      </Menu>

      {/* Create Loan Modal */}
      <CreateLoanModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Loan Modal */}
      <EditLoanModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedLoanData(null);
        }}
        onSuccess={handleEditSuccess}
        loan={selectedLoanData || undefined}
      />

      {/* View Loan Modal */}
      <ViewLoanModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedLoanData(null);
        }}
        loan={selectedLoanData || undefined}
      />
      

    </Box>
  );
};

export default LoanList;
