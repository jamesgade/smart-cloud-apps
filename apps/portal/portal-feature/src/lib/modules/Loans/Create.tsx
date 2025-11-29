import React from 'react';
import { useCreate } from '@refinedev/core';
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
  Divider,
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
  Description as DescriptionIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { loanModalStyles, getSectionIcon, combineStyles } from './styles';

interface CreateLoanModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const loanSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  loanAmountMin: z.number().min(0, 'Minimum amount must be positive').optional(),
  loanAmountMax: z.number().min(0, 'Maximum amount must be positive').optional(),
  coverageDetails: z.string().optional(),
  interestRate: z.number().min(0).max(50, 'Interest rate must be between 0 and 50').optional(),
  interestType: z.enum(['FIXED', 'FLOATING']).default('FIXED'),
  moratoriumPeriodMonths: z.number().min(0).max(60, 'Moratorium period must be between 0 and 60 months').optional(),
  repaymentDurationMonths: z.number().min(1).max(300, 'Repayment duration must be between 1 and 300 months').optional(),
  eligibilityCriteria: z.string().optional(),
  collateralRequired: z.boolean().default(false),
  collateralThresholdAmount: z.number().min(0, 'Threshold amount must be positive').optional(),
  guarantorRequired: z.boolean().default(false),
  overallRemarks: z.string().optional(),
  isActive: z.boolean().default(true),
}).refine((data) => {
  if (data.loanAmountMin && data.loanAmountMax) {
    return data.loanAmountMax >= data.loanAmountMin;
  }
  return true;
}, {
  message: 'Maximum amount must be greater than or equal to minimum amount',
  path: ['loanAmountMax'],
});

type LoanFormData = z.infer<typeof loanSchema>;

const CreateLoanModal: React.FC<CreateLoanModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { mutate: createLoan, isLoading } = useCreate();

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
    mode: 'onChange', // Only validate on change, not on every keystroke
  });

  // Memoize the watch to prevent unnecessary re-renders
  const collateralRequired = React.useMemo(() => watch('collateralRequired'), [watch]);

  const interestTypes = [
    { value: 'FIXED', label: 'Fixed Rate' },
    { value: 'FLOATING', label: 'Floating Rate' },
  ];

  const onSubmit = React.useCallback((data: LoanFormData) => {
    createLoan(
      {
        resource: 'loans',
        values: data,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
          onSuccess();
        },
      }
    );
  }, [createLoan, reset, onClose, onSuccess]);

  const handleClose = React.useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{ sx: loanModalStyles.dialog }}
    >
      <DialogTitle sx={loanModalStyles.header}>
        <BankIcon sx={{ fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Create New Loan Offering
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            Add a new loan product to the system
          </Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 0 }}>
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
                          label="Bank / Financial Institution Name"
                          placeholder="e.g., State Bank of India, HDFC Bank"
                          error={!!errors.bankName}
                          helperText={errors.bankName?.message || "Enter the full name of the bank or financial institution"}
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
                        <FormControl fullWidth error={!!errors.interestType}>
                          <InputLabel>Interest Type</InputLabel>
                          <Select 
                            {...field} 
                            label="Interest Type"
                            sx={{ 
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              height: '56px',
                            }
                          }}
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
            <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <MoneyIcon sx={{ color: '#4caf50', mr: 1 }} />
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
                          placeholder="50000"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          error={!!errors.loanAmountMin}
                          helperText={errors.loanAmountMin?.message || "Minimum amount in ₹"}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">₹</InputAdornment>
                            ),
                          }}
                          sx={{ 
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              height: '56px',
                            }
                          }}
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
                          placeholder="2000000"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          error={!!errors.loanAmountMax}
                          helperText={errors.loanAmountMax?.message || "Maximum amount in ₹"}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">₹</InputAdornment>
                            ),
                          }}
                          sx={{ 
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              height: '56px',
                            }
                          }}
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
                          sx={{ 
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              height: '56px',
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Interest Rate & Terms Section */}
            <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <InterestIcon sx={{ color: '#ff9800', mr: 1 }} />
                  <Typography variant="h6" fontWeight={600} color="primary">
                    Interest Rate & Repayment Terms
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="interestRate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Interest Rate (Annual %)"
                          type="number"
                          placeholder="8.50"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          error={!!errors.interestRate}
                          helperText={errors.interestRate?.message || "Annual interest rate"}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                          sx={{ 
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              height: '56px',
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Controller
                      name="moratoriumPeriodMonths"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Moratorium Period (Months)"
                          type="number"
                          placeholder="12"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          error={!!errors.moratoriumPeriodMonths}
                          helperText={errors.moratoriumPeriodMonths?.message || "Grace period before repayment starts"}
                          sx={{ 
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              height: '56px',
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Controller
                      name="repaymentDurationMonths"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Repayment Duration (Months)"
                          type="number"
                          placeholder="180"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          error={!!errors.repaymentDurationMonths}
                          helperText={errors.repaymentDurationMonths?.message || "Total repayment period"}
                          sx={{ 
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              height: '56px',
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Eligibility & Requirements Section */}
            <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PersonIcon sx={{ color: '#ff6b35', mr: 1 }} />
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
                          sx={{ 
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              minHeight: '80px',
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <SecurityIcon sx={{ color: '#f44336', mr: 1 }} />
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
                                onChange={(e) => field.onChange(e.target.checked)}
                                color="error"
                              />
                            )}
                          />
                        }
                        label="Collateral Required"
                        sx={{ mb: 1 }}
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
                              placeholder="500000"
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                              error={!!errors.collateralThresholdAmount}
                              helperText={errors.collateralThresholdAmount?.message}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">₹</InputAdornment>
                                ),
                              }}
                              sx={{ 
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              height: '56px',
                            }
                          }}
                            />
                          )}
                        />
                      )}
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <PersonIcon sx={{ color: '#ff6b35', mr: 1 }} />
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
                                onChange={(e) => field.onChange(e.target.checked)}
                                color="warning"
                              />
                            )}
                          />
                        }
                        label="Guarantor Required"
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Additional Information Section */}
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <DescriptionIcon sx={{ color: '#607d8b', mr: 1 }} />
                  <Typography variant="h6" fontWeight={600} color="primary">
                    Additional Information
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Controller
                      name="overallRemarks"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Overall Remarks / Notes"
                          placeholder="e.g., Lowest interest rates, flexible repayment options, no processing fee for loans up to ₹7.5 lakhs"
                          multiline
                          rows={3}
                          error={!!errors.overallRemarks}
                          helperText={errors.overallRemarks?.message || "Key features, advantages, or special schemes"}
                          sx={{ 
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              minHeight: '80px',
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                      <FormControlLabel
                        control={
                          <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                              <Switch
                                {...field}
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                color="success"
                              />
                            )}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Active Loan Offering
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Enable this loan product for students to apply
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          p: 3, 
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #e0e0e0'
        }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            size="large"
            sx={{ 
              borderRadius: 2,
              px: 4,
              py: 1.5
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            size="large"
            startIcon={isLoading ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
              },
            }}
          >
            {isLoading ? 'Creating...' : 'Create Loan Offering'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateLoanModal;