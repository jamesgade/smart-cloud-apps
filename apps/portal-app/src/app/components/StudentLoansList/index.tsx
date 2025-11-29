import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Button,
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as InterestIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  OpenInNew as ExternalLinkIcon,
} from '@mui/icons-material';
import axiosInstance from '../../libs/axiosInstance';
import { API_BASE_URL } from '../../libs/constants';
import { applicationService } from '../../services/applicationService';
import { useGetIdentity } from '@refinedev/core';

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
  guarantorRequired: boolean;
  overallRemarks?: string;
  isActive: boolean;
}

const StudentLoansList: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  const { data: identity } = useGetIdentity();

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`${API_BASE_URL}/loans?limit=100`);
      setLoans(response.data.data || []);
    } catch (err) {
      setError('Failed to load loans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForLoan = async (loan: Loan) => {
    if (!identity?.studentId && !identity?.userId && !identity?.sub) {
      setError('Student information not found. Please try again.');
      return;
    }

    try {
      setApplying(loan.loanId);
      setError(null);

      await applicationService.createApplication({
        studentId: identity.studentId || identity.userId || identity.sub,
        studentName: identity.firstName + ' ' + identity.lastName,
        applicationType: 'LOAN',
        applicationTitle: loan.bankName,
        applicationDetails: `Loan Amount: ${loan.loanAmountMin ? `₹${loan.loanAmountMin.toLocaleString()}` : 'Not specified'} - ${loan.loanAmountMax ? `₹${loan.loanAmountMax.toLocaleString()}` : 'Not specified'}, Interest Rate: ${loan.interestRate || 'Not specified'}%, Coverage: ${loan.coverageDetails || 'Not specified'}`,
      });

      alert(`Application submitted successfully for ${loan.bankName} loan!`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setApplying(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatAmountRange = (min?: number, max?: number) => {
    if (min && max) {
      return `${formatCurrency(min)} - ${formatCurrency(max)}`;
    } else if (min) {
      return `From ${formatCurrency(min)}`;
    } else if (max) {
      return `Up to ${formatCurrency(max)}`;
    }
    return 'Not specified';
  };

  const renderRequirements = (loan: Loan) => {
    const requirements = [];
    if (loan.collateralRequired) requirements.push('Collateral');
    if (loan.guarantorRequired) requirements.push('Guarantor');
    if (!loan.collateralRequired && !loan.guarantorRequired) requirements.push('None');
    return requirements.join(', ');
  };

  const renderDuration = (loan: Loan) => {
    const parts = [];
    if (loan.moratoriumPeriodMonths) parts.push(`Moratorium: ${loan.moratoriumPeriodMonths}m`);
    if (loan.repaymentDurationMonths) parts.push(`Repayment: ${loan.repaymentDurationMonths}m`);
    return parts.join(' | ');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
          Education Loans
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore available education loan options from various banks and financial institutions
        </Typography>
      </Box>

      {/* Loans Table */}
      {loans.length > 0 ? (
        <Card>
          <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Bank</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Loan Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Interest Rate</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Requirements</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 300 }}>Coverage</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan.loanId} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BankIcon sx={{ color: '#FF6B35', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {loan.bankName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#2E7D32' }}>
                        {formatAmountRange(loan.loanAmountMin, loan.loanAmountMax)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {loan.interestRate ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <InterestIcon sx={{ color: '#1976D2', mr: 0.5, fontSize: 16 }} />
                          <Typography variant="body2">
                            {loan.interestRate}% {loan.interestType}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Not specified
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {renderRequirements(loan)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {renderDuration(loan) || 'Not specified'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 300,
                          lineHeight: 1.4,
                          wordWrap: 'break-word'
                        }}
                      >
                        {loan.coverageDetails || 'Not specified'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={applying === loan.loanId}
                        sx={{
                          borderColor: '#FF6B35',
                          color: '#FF6B35',
                          '&:hover': {
                            borderColor: '#FF6B35',
                            backgroundColor: 'rgba(255, 107, 53, 0.08)',
                          },
                        }}
                        onClick={() => handleApplyForLoan(loan)}
                      >
                        {applying === loan.loanId ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          'Apply Now'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', backgroundColor: '#fafafa' }}>
          <BankIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
            No loans available
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check back later for available education loan options
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default StudentLoansList;
