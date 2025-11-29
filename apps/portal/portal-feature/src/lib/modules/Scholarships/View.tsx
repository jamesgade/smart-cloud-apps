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
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  School as SchoolIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Book as BookIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
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

interface ViewScholarshipModalProps {
  open: boolean;
  onClose: () => void;
  scholarship?: Scholarship;
}

const ViewScholarshipModal: React.FC<ViewScholarshipModalProps> = ({
  open,
  onClose,
  scholarship,
}) => {
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!scholarship) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, gap: 2 }}>
            <Typography variant="h6" color="error">
              Scholarship not found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The requested scholarship information could not be loaded.
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
      PaperProps={{ sx: scholarshipModalStyles.dialog }}
    >
      <DialogTitle sx={scholarshipModalStyles.header}>
        <ViewIcon sx={{ fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Scholarship Details
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            View comprehensive information about this scholarship opportunity.
          </Typography>
        </Box>
      </DialogTitle>
      
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
                  <TextField
                    fullWidth
                    label="Scholarship Name"
                    value={scholarship.scholarshipName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SchoolIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.singleLineField, scholarshipModalStyles.fixedDimensions)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Provider / Organization"
                    value={scholarship.provider}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.singleLineField, scholarshipModalStyles.fixedDimensions)}
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
                  <TextField
                    fullWidth
                    label="Eligibility Criteria"
                    value={scholarship.eligibilityCriteria || 'Not specified'}
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
                    sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.fixedHeightField, scholarshipModalStyles.fixedDimensions)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Applicable Courses"
                    value={scholarship.applicableCourses || 'Not specified'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BookIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.singleLineField, scholarshipModalStyles.fixedDimensions)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Education Level"
                    value={scholarship.educationLevel || 'Not specified'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CheckIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.singleLineField, scholarshipModalStyles.fixedDimensions)}
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
                  <TextField
                    fullWidth
                    label="Scholarship Amount"
                    value={scholarship.scholarshipAmount ? formatCurrency(scholarship.scholarshipAmount) : 'Not specified'}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      readOnly: true,
                    }}
                    sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.singleLineField, scholarshipModalStyles.fixedDimensions)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Benefits Description"
                    value={scholarship.benefitsDescription || 'Not specified'}
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
                    sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.fixedHeightField, scholarshipModalStyles.fixedDimensions)}
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
                  <TextField
                    fullWidth
                    label="Application Process"
                    value={scholarship.applicationProcess || 'Not specified'}
                    multiline
                    rows={3}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AssignmentIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.fixedHeightField, scholarshipModalStyles.fixedDimensions)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Portal Link"
                    value={scholarship.portalLink || 'Not specified'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CheckIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.singleLineField, scholarshipModalStyles.fixedDimensions)}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Application Start Date"
                    value={formatDate(scholarship.applicationStartDate)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.singleLineField, scholarshipModalStyles.fixedDimensions)}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Application End Date"
                    value={formatDate(scholarship.applicationEndDate)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.singleLineField, scholarshipModalStyles.fixedDimensions)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Renewal Schedule"
                    value={scholarship.renewalSchedule || 'Not specified'}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CheckIcon color="action" />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.fixedHeightField, scholarshipModalStyles.fixedDimensions)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Overall Remarks / Notes"
                    value={scholarship.overallRemarks || 'No additional remarks'}
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
                    sx={combineStyles(scholarshipModalStyles.textField, scholarshipModalStyles.fixedHeightField, scholarshipModalStyles.fixedDimensions)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                      Status:
                    </Typography>
                    <Chip
                      label={scholarship.isActive ? 'Active' : 'Inactive'}
                      color={scholarship.isActive ? 'success' : 'error'}
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
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={scholarshipModalStyles.cancelButton}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewScholarshipModal;
