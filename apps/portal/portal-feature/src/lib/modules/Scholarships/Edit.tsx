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
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import {
  School as SchoolIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Book as BookIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { scholarshipModalStyles, getSectionIcon, combineStyles } from './styles';

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

interface EditScholarshipModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  scholarship?: Scholarship;
}

const scholarshipSchema = z.object({
  scholarshipName: z.string().min(1, 'Scholarship name is required'),
  provider: z.string().min(1, 'Provider is required'),
  eligibilityCriteria: z.string().optional(),
  applicableCourses: z.string().optional(),
  educationLevel: z.string().optional(),
  scholarshipAmount: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().min(0, 'Scholarship amount cannot be negative').optional()
  ),
  benefitsDescription: z.string().optional(),
  applicationProcess: z.string().optional(),
  portalLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  applicationStartDate: z.string().optional(),
  applicationEndDate: z.string().optional(),
  renewalSchedule: z.string().optional(),
  overallRemarks: z.string().optional(),
  isActive: z.boolean().default(true),
});

type ScholarshipFormData = z.infer<typeof scholarshipSchema>;

const EditScholarshipModal: React.FC<EditScholarshipModalProps> = ({
  open,
  onClose,
  onSuccess,
  scholarship,
}) => {
  const { mutate: updateScholarship, isLoading } = useUpdate();
  const [loadingTimeout, setLoadingTimeout] = React.useState(false);

  // Add timeout for loading state
  React.useEffect(() => {
    if (open && !scholarship) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000); // 5 second timeout

      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [open, scholarship]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScholarshipFormData>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: {
      isActive: true,
    },
    mode: 'onChange',
  });

  // Reset form when scholarship changes
  React.useEffect(() => {
    if (scholarship) {
      reset({
        scholarshipName: scholarship.scholarshipName || '',
        provider: scholarship.provider || '',
        eligibilityCriteria: scholarship.eligibilityCriteria || '',
        applicableCourses: scholarship.applicableCourses || '',
        educationLevel: scholarship.educationLevel || '',
        scholarshipAmount: scholarship.scholarshipAmount ? Number(scholarship.scholarshipAmount) : undefined,
        benefitsDescription: scholarship.benefitsDescription || '',
        applicationProcess: scholarship.applicationProcess || '',
        portalLink: scholarship.portalLink || '',
        applicationStartDate: scholarship.applicationStartDate || '',
        applicationEndDate: scholarship.applicationEndDate || '',
        renewalSchedule: scholarship.renewalSchedule || '',
        overallRemarks: scholarship.overallRemarks || '',
        isActive: Boolean(scholarship.isActive),
      });
    }
  }, [scholarship, reset]);

  const educationLevels = [
    { value: 'UG', label: 'Undergraduate' },
    { value: 'PG', label: 'Postgraduate' },
    { value: 'PhD', label: 'Doctorate' },
    { value: 'Abroad', label: 'International' },
    { value: 'All', label: 'All Levels' },
  ];

  const onSubmit = React.useCallback((data: ScholarshipFormData) => {
    if (!scholarship?.scholarshipId) {
      console.error('No scholarship ID available');
      return;
    }
    
    updateScholarship(
      {
        resource: 'scholarships',
        id: scholarship.scholarshipId,
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
        },
      }
    );
  }, [updateScholarship, scholarship?.scholarshipId, onClose, onSuccess, reset]);

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
      PaperProps={{ sx: scholarshipModalStyles.dialog }}
    >
      <DialogTitle sx={scholarshipModalStyles.header}>
        <EditIcon sx={{ fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Edit Scholarship
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Update the details for this scholarship opportunity.
          </Typography>
        </Box>
      </DialogTitle>
      
      {!scholarship || !scholarship.scholarshipId ? (
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, gap: 2 }}>
            {loadingTimeout ? (
              <>
                <Typography variant="h6" color="error">
                  Failed to load scholarship data
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
                  Loading scholarship data...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we fetch the scholarship information.
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
              <Card sx={scholarshipModalStyles.sectionCard}>
                <CardContent>
                  <Box sx={scholarshipModalStyles.sectionHeader}>
                    <SchoolIcon sx={getSectionIcon('basic')} />
                    <Typography variant="h6" fontWeight={600} color="primary">
                      Basic Information
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="scholarshipName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Scholarship Name *"
                            placeholder="e.g., National Scholarship Portal"
                            error={!!errors.scholarshipName}
                            helperText={errors.scholarshipName?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SchoolIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                            sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.singleLineField, scholarshipModalStyles.fixedDimensions)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="provider"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Provider / Organization *"
                            placeholder="e.g., Government of India"
                            error={!!errors.provider}
                            helperText={errors.provider?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BusinessIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                            sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.singleLineField, scholarshipModalStyles.fixedDimensions)}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Eligibility & Courses Section */}
              <Card sx={scholarshipModalStyles.sectionCard}>
                <CardContent>
                  <Box sx={scholarshipModalStyles.sectionHeader}>
                    <PersonIcon sx={getSectionIcon('eligibility')} />
                    <Typography variant="h6" fontWeight={600} color="primary">
                      Eligibility & Courses
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
                            placeholder="e.g., Indian citizen, family income below ₹8 lakhs, minimum 60% marks"
                            multiline
                            rows={3}
                            error={!!errors.eligibilityCriteria}
                            helperText={errors.eligibilityCriteria?.message}
                            sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.fixedHeightField, scholarshipModalStyles.fixedDimensions)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="applicableCourses"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Applicable Courses"
                            placeholder="e.g., Engineering, Medicine, Management"
                            error={!!errors.applicableCourses}
                            helperText={errors.applicableCourses?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BookIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                            sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.singleLineField, scholarshipModalStyles.fixedDimensions)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="educationLevel"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.educationLevel} sx={combineStyles(scholarshipModalStyles.formControl, scholarshipModalStyles.singleLineFormControl, scholarshipModalStyles.fixedDimensions)}>
                            <InputLabel>Education Level</InputLabel>
                            <Select 
                              {...field} 
                              label="Education Level"
                              sx={scholarshipModalStyles.singleLineFormControl}
                            >
                              {educationLevels.map((level) => (
                                <MenuItem key={level.value} value={level.value}>
                                  {level.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.educationLevel && (
                              <FormHelperText>{errors.educationLevel.message}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Scholarship Amount & Benefits Section */}
              <Card sx={scholarshipModalStyles.sectionCard}>
                <CardContent>
                  <Box sx={scholarshipModalStyles.sectionHeader}>
                    <MoneyIcon sx={getSectionIcon('amount')} />
                    <Typography variant="h6" fontWeight={600} color="primary">
                      Scholarship Amount & Benefits
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="scholarshipAmount"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Scholarship Amount"
                            type="number"
                            placeholder="e.g., 50000"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                              sx: scholarshipModalStyles.inputAdornment
                            }}
                            error={!!errors.scholarshipAmount}
                            helperText={errors.scholarshipAmount?.message}
                            sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.singleLineField, scholarshipModalStyles.fixedDimensions)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="benefitsDescription"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Benefits Description"
                            placeholder="e.g., Tuition fee reimbursement, living allowance, laptop, travel expenses"
                            multiline
                            rows={3}
                            error={!!errors.benefitsDescription}
                            helperText={errors.benefitsDescription?.message}
                            sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.fixedHeightField, scholarshipModalStyles.fixedDimensions)}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Application Process & Dates Section */}
              <Card sx={scholarshipModalStyles.sectionCard}>
                <CardContent>
                  <Box sx={scholarshipModalStyles.sectionHeader}>
                    <AssignmentIcon sx={getSectionIcon('application')} />
                    <Typography variant="h6" fontWeight={600} color="primary">
                      Application Process & Important Dates
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Controller
                        name="applicationProcess"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Application Process"
                            placeholder="e.g., Online application through NSP portal, submit documents"
                            multiline
                            rows={3}
                            error={!!errors.applicationProcess}
                            helperText={errors.applicationProcess?.message}
                            sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.fixedHeightField, scholarshipModalStyles.fixedDimensions)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="portalLink"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Portal Link"
                            placeholder="e.g., https://scholarships.gov.in"
                            error={!!errors.portalLink}
                            helperText={errors.portalLink?.message}
                            sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.singleLineField, scholarshipModalStyles.fixedDimensions)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Controller
                        name="applicationStartDate"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Application Start Date"
                            type="date"
                            error={!!errors.applicationStartDate}
                            helperText={errors.applicationStartDate?.message}
                            InputLabelProps={{ shrink: true }}
                            sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.singleLineField, scholarshipModalStyles.fixedDimensions)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Controller
                        name="applicationEndDate"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Application End Date"
                            type="date"
                            error={!!errors.applicationEndDate}
                            helperText={errors.applicationEndDate?.message}
                            InputLabelProps={{ shrink: true }}
                            sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.singleLineField, scholarshipModalStyles.fixedDimensions)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="renewalSchedule"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Renewal Schedule"
                            placeholder="e.g., Annual renewal based on academic performance"
                            multiline
                            rows={2}
                            error={!!errors.renewalSchedule}
                            helperText={errors.renewalSchedule?.message}
                            sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.fixedHeightField, scholarshipModalStyles.fixedDimensions)}
                          />
                        )}
                      />
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
                            placeholder="e.g., Highly reliable, easy application process, competitive"
                            multiline
                            rows={3}
                            error={!!errors.overallRemarks}
                            helperText={errors.overallRemarks?.message}
                            sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.fixedHeightField, scholarshipModalStyles.fixedDimensions)}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} disabled={isLoading} sx={scholarshipModalStyles.cancelButton}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={scholarshipModalStyles.actionButton}
            >
              {isLoading ? 'Updating...' : 'Update Scholarship'}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};

export default EditScholarshipModal;
