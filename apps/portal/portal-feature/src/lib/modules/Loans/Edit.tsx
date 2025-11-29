import React from 'react';
import { useUpdate } from '@refinedev/core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  FormHelperText,
  Grid,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  InputAdornment,
  Paper,
  Alert,
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as InterestIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Edit as EditIcon,
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

interface EditLoanModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  loan?: Loan;
}

const loanSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  loanAmountMin: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().min(0, 'Minimum loan amount cannot be negative').optional()
  ),
  loanAmountMax: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().min(0, 'Maximum loan amount cannot be negative').optional()
  ),
  coverageDetails: z.string().optional(),
  interestRate: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().min(0, 'Interest rate cannot be negative').max(100, 'Interest rate cannot exceed 100').optional()
  ),
  interestType: z.string().optional(),
  moratoriumPeriodMonths: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().min(0, 'Moratorium period cannot be negative').optional()
  ),
  repaymentDurationMonths: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().min(1, 'Repayment duration must be at least 1 month').optional()
  ),
  eligibilityCriteria: z.string().optional(),
  collateralRequired: z.boolean().default(false),
  collateralThresholdAmount: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().min(0, 'Threshold amount cannot be negative').optional()
  ),
  guarantorRequired: z.boolean().default(false),
  overallRemarks: z.string().optional(),
  isActive: z.boolean().default(true),
}).refine(data => {
  if (data.loanAmountMin !== undefined && data.loanAmountMax !== undefined) {
    return data.loanAmountMax >= data.loanAmountMin;
  }
  return true;
}, {
  message: 'Max loan amount must be greater than or equal to Min loan amount',
  path: ['loanAmountMax'],
});

type LoanFormData = z.infer<typeof loanSchema>;

const EditLoanModal: React.FC<EditLoanModalProps> = ({
  open,
  onClose,
  onSuccess,
  loan,
}) => {
  const { mutate: updateLoan, isLoading } = useUpdate();
  const [loadingTimeout, setLoadingTimeout] = React.useState(false);


  // Add timeout for loading state
  React.useEffect(() => {
    if (open && !loan) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000); // 5 second timeout

      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [open, loan]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      interestType: 'FIXED',
      collateralRequired: false,
      guarantorRequired: false,
      isActive: true,
    },
    mode: 'onChange',
  });

  // Reset form when loan changes
  React.useEffect(() => {
    if (loan) {
      reset({
        bankName: loan.bankName || '',
        loanAmountMin: loan.loanAmountMin ? Number(loan.loanAmountMin) : undefined,
        loanAmountMax: loan.loanAmountMax ? Number(loan.loanAmountMax) : undefined,
        coverageDetails: loan.coverageDetails || '',
        interestRate: loan.interestRate ? Number(loan.interestRate) : undefined,
        interestType: loan.interestType || 'FIXED',
        moratoriumPeriodMonths: loan.moratoriumPeriodMonths ? Number(loan.moratoriumPeriodMonths) : undefined,
        repaymentDurationMonths: loan.repaymentDurationMonths ? Number(loan.repaymentDurationMonths) : undefined,
        eligibilityCriteria: loan.eligibilityCriteria || '',
        collateralRequired: Boolean(loan.collateralRequired),
        collateralThresholdAmount: loan.collateralThresholdAmount ? Number(loan.collateralThresholdAmount) : undefined,
        guarantorRequired: Boolean(loan.guarantorRequired),
        overallRemarks: loan.overallRemarks || '',
        isActive: Boolean(loan.isActive),
      });
    }
  }, [loan, reset]);

  // Memoize the watch to prevent unnecessary re-renders
  const collateralRequired = React.useMemo(() => watch('collateralRequired'), [watch]);

  // Debug: Watch form values
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const interestTypes = [
    { value: 'FIXED', label: 'Fixed Rate' },
    { value: 'FLOATING', label: 'Floating Rate' },
  ];

  const onSubmit = React.useCallback((data: LoanFormData) => {
    if (!loan?.loanId) {
      console.error('No loan ID available');
      return;
    }
    
    updateLoan(
      {
        resource: 'loans',
        id: loan.loanId,
        values: data,
      },
      {
        onSuccess: (response) => {
          reset();
          onClose();
          onSuccess();
        },
        onError: (error) => {
          console.error('Update failed:', error);
          console.error('Error details:', error);
        },
      }
    );
  }, [updateLoan, loan?.loanId, onClose, onSuccess, reset]);

  const handleClose = React.useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: loanModalStyles.dialog }}
    >
      <DialogTitle sx={loanModalStyles.header}>
        <EditIcon sx={{ fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Edit Loan Offering
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Update the details for this loan product.
          </Typography>
        </Box>
      </DialogTitle>
      
      {!loan || !loan.loanId ? (
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, gap: 2 }}>
            {loadingTimeout ? (
              <>
                <Typography variant="h6" color="error">
                  Failed to load loan data
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please try again or contact support if the problem persists.
                </Typography>
                <Button onClick={onClose} variant="outlined">
                  Close
                </Button>
              </>
            ) : (
              <>
                <CircularProgress size={40} />
                <Typography variant="h6">
                  Loading loan data...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we fetch the loan information.
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                      <Controller
                        name="bankName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Bank / Financial Institution Name *"
                            placeholder="e.g., State Bank of India"
                            error={!!errors.bankName}
                            helperText={errors.bankName?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BankIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                            sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="interestType"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.interestType} sx={combineStyles(loanModalStyles.formControl, loanModalStyles.singleLineFormControl)}>
                            <InputLabel>Interest Type *</InputLabel>
                            <Select 
                              {...field} 
                              label="Interest Type"
                              sx={loanModalStyles.singleLineFormControl}
                            >
                              {interestTypes.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <InterestIcon fontSize="small" />
                                    {type.label}
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.interestType && (
                              <FormHelperText>{errors.interestType.message}</FormHelperText>
                            )}
                          </FormControl>
                        )}
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
                      <Controller
                        name="loanAmountMin"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Minimum Loan Amount"
                            type="number"
                            placeholder="e.g., 50000"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                              sx: loanModalStyles.inputAdornment
                            }}
                            error={!!errors.loanAmountMin}
                            helperText={errors.loanAmountMin?.message}
                            sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="loanAmountMax"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Maximum Loan Amount"
                            type="number"
                            placeholder="e.g., 2000000"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                              sx: loanModalStyles.inputAdornment
                            }}
                            error={!!errors.loanAmountMax}
                            helperText={errors.loanAmountMax?.message || errors.root?.message}
                            sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="coverageDetails"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Coverage Details"
                            placeholder="e.g., Tuition fees, hostel fees, books, equipment, travel expenses"
                            error={!!errors.coverageDetails}
                            helperText={errors.coverageDetails?.message || "What does this loan cover?"}
                            sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                          />
                        )}
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
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="interestRate"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Interest Rate (Annual %)"
                            type="number"
                            placeholder="e.g., 8.50"
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              sx: loanModalStyles.inputAdornment
                            }}
                            error={!!errors.interestRate}
                            helperText={errors.interestRate?.message}
                            sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="moratoriumPeriodMonths"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Moratorium Period (Months)"
                            type="number"
                            placeholder="e.g., 12"
                            InputProps={{ sx: loanModalStyles.inputAdornment }}
                            error={!!errors.moratoriumPeriodMonths}
                            helperText={errors.moratoriumPeriodMonths?.message}
                            sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="repaymentDurationMonths"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Repayment Duration (Months)"
                            type="number"
                            placeholder="e.g., 180"
                            InputProps={{ sx: loanModalStyles.inputAdornment }}
                            error={!!errors.repaymentDurationMonths}
                            helperText={errors.repaymentDurationMonths?.message}
                            sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                          />
                        )}
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
                      <Controller
                        name="eligibilityCriteria"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Eligibility Criteria"
                            placeholder="e.g., Indian citizen, admitted to recognized institution, co-applicant required for loans above ₹7.5 lakhs"
                            multiline
                            rows={3}
                            error={!!errors.eligibilityCriteria}
                            helperText={errors.eligibilityCriteria?.message || "Who can apply for this loan?"}
                            sx={combineStyles(loanModalStyles.textField, loanModalStyles.multilineField)}
                          />
                        )}
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
                        
                        <FormControlLabel
                          control={
                            <Controller
                              name="collateralRequired"
                              control={control}
                              render={({ field }) => (
                                <Switch
                                  {...field}
                                  checked={field.value}
                                  color="primary"
                                />
                              )}
                            />
                          }
                          label="Collateral Required"
                        />
                        
                        {collateralRequired && (
                          <Controller
                            name="collateralThresholdAmount"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Collateral Threshold Amount"
                                type="number"
                                placeholder="e.g., 1000000"
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                  sx: loanModalStyles.inputAdornment
                                }}
                                error={!!errors.collateralThresholdAmount}
                                helperText={errors.collateralThresholdAmount?.message}
                                sx={combineStyles(loanModalStyles.textField, loanModalStyles.singleLineField)}
                              />
                            )}
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
                        
                        <FormControlLabel
                          control={
                            <Controller
                              name="guarantorRequired"
                              control={control}
                              render={({ field }) => (
                                <Switch
                                  {...field}
                                  checked={field.value}
                                  color="primary"
                                />
                              )}
                            />
                          }
                          label="Guarantor Required"
                        />
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="overallRemarks"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Overall Remarks / Notes"
                            placeholder="e.g., Special features, advantages, or additional notes about this loan"
                            multiline
                            rows={3}
                            error={!!errors.overallRemarks}
                            helperText={errors.overallRemarks?.message}
                            sx={combineStyles(loanModalStyles.textField, loanModalStyles.multilineField)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                              <Switch
                                {...field}
                                checked={field.value}
                                color="primary"
                              />
                            )}
                          />
                        }
                        label="Active Loan Product"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} disabled={isLoading} sx={loanModalStyles.cancelButton}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={loanModalStyles.actionButton}
            >
              {isLoading ? 'Updating...' : 'Update Loan'}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};

export default EditLoanModal;