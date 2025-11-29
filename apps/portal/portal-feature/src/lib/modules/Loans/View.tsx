import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as InterestIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { loanModalStyles, getSectionIcon, combineStyles } from './styles';

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

interface ViewLoanModalProps {
  open: boolean;
  onClose: () => void;
  loan?: Loan;
}

const ViewLoanModal: React.FC<ViewLoanModalProps> = ({
  open,
  onClose,
  loan,
}) => {
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to format amount range
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

  // Helper function to format months
  const formatMonths = (months?: number) => {
    if (!months) return 'Not specified';
    if (months === 1) return '1 month';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) {
      return years === 1 ? '1 year' : `${years} years`;
    }
    return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  };

  if (!loan) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, gap: 2 }}>
            <Typography variant="h6" color="error">
              Loan not found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The requested loan information could not be loaded.
            </Typography>
            <Button onClick={onClose} variant="outlined">
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: loanModalStyles.dialog }}
    >
      <DialogTitle sx={loanModalStyles.header}>
        <ViewIcon sx={{ fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Loan Details
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            View comprehensive information about this loan offering.
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ p: 4 }}>
          {/* Basic Information Section */}
          <Card sx={loanModalStyles.sectionCard}>
            <CardContent>
              <Box sx={loanModalStyles.sectionHeader}>
                <BankIcon sx={getSectionIcon('basic')} />
                <Typography variant="h6" fontWeight={600} color="primary">
                  Basic Information
                </Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Bank / Financial Institution Name"
                    value={loan.bankName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BankIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Interest Type"
                    value={loan.interestType}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <InterestIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Loan Amount & Coverage Section */}
          <Card sx={loanModalStyles.sectionCard}>
            <CardContent>
              <Box sx={loanModalStyles.sectionHeader}>
                <MoneyIcon sx={getSectionIcon('amount')} />
                <Typography variant="h6" fontWeight={600} color="primary">
                  Loan Amount & Coverage
                </Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Minimum Loan Amount"
                    value={loan.loanAmountMin ? formatCurrency(loan.loanAmountMin) : 'Not specified'}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      readOnly: true,
                    }}
                    sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Maximum Loan Amount"
                    value={loan.loanAmountMax ? formatCurrency(loan.loanAmountMax) : 'Not specified'}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      readOnly: true,
                    }}
                    sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Coverage Details"
                    value={loan.coverageDetails || 'Not specified'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CheckIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Interest Rate & Terms Section */}
          <Card sx={loanModalStyles.sectionCard}>
            <CardContent>
              <Box sx={loanModalStyles.sectionHeader}>
                <InterestIcon sx={getSectionIcon('interest')} />
                <Typography variant="h6" fontWeight={600} color="primary">
                  Interest Rate & Repayment Terms
                </Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Interest Rate (Annual %)"
                    value={loan.interestRate ? `${loan.interestRate}% per annum` : 'Not specified'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <InterestIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Moratorium Period (Months)"
                    value={formatMonths(loan.moratoriumPeriodMonths)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CheckIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Repayment Duration (Months)"
                    value={formatMonths(loan.repaymentDurationMonths)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CheckIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Eligibility & Requirements Section */}
          <Card sx={loanModalStyles.sectionCard}>
            <CardContent>
              <Box sx={loanModalStyles.sectionHeader}>
                <PersonIcon sx={getSectionIcon('eligibility')} />
                <Typography variant="h6" fontWeight={600} color="primary">
                  Eligibility & Requirements
                </Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Eligibility Criteria"
                    value={loan.eligibilityCriteria || 'Not specified'}
                    multiline
                    rows={3}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(loanModalStyles.textField, loanModalStyles.multilineField)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={loanModalStyles.requirementsPaper}>
                    <Box sx={loanModalStyles.requirementsHeader}>
                      <SecurityIcon sx={getSectionIcon('collateral')} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        Collateral Requirements
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      {loan.collateralRequired ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                      <Typography variant="body1" fontWeight={600}>
                        {loan.collateralRequired ? 'Required' : 'Not Required'}
                      </Typography>
                    </Box>
                    {loan.collateralRequired && loan.collateralThresholdAmount && (
                      <TextField
                        fullWidth
                        label="Collateral Threshold Amount"
                        value={formatCurrency(loan.collateralThresholdAmount)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          readOnly: true,
                        }}
                        sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                      />
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={loanModalStyles.requirementsPaper}>
                    <Box sx={loanModalStyles.requirementsHeader}>
                      <PersonIcon sx={getSectionIcon('guarantor')} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        Guarantor Requirements
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      {loan.guarantorRequired ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                      <Typography variant="body1" fontWeight={600}>
                        {loan.guarantorRequired ? 'Required' : 'Not Required'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Overall Remarks / Notes"
                    value={loan.overallRemarks || 'No additional remarks'}
                    multiline
                    rows={3}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CheckIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(loanModalStyles.textField, loanModalStyles.multilineField)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                      Status:
                    </Typography>
                    <Chip
                      label={loan.isActive ? 'Active' : 'Inactive'}
                      color={loan.isActive ? 'success' : 'error'}
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
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={loanModalStyles.cancelButton}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewLoanModal;