import React from 'react';
import { useGetIdentity, useCreate } from '@refinedev/core';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Rating,
  Chip,
  Divider,
  IconButton,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  School as SchoolIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import axios from 'axios';

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

interface ViewDetailsProps {
  open: boolean;
  onClose: () => void;
  college: College | null;
}

const ViewDetails: React.FC<ViewDetailsProps> = ({ open, onClose, college }) => {
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  const [isApplying, setIsApplying] = React.useState(false);
  const [applySuccess, setApplySuccess] = React.useState(false);
  const [applyError, setApplyError] = React.useState<string | null>(null);
  const { data: user } = useGetIdentity();
  const { mutate: createApplication } = useCreate();
  
  // Check if user is a student
  const isStudent = user?.userTypeName?.toLowerCase() === 'student' || user?.roleName?.toLowerCase() === 'student';

  // Helper function to format currency in lakhs
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Not specified';
    const lakhs = amount / 100000;
    if (lakhs >= 1) {
      return `₹${lakhs.toFixed(1)} lakhs (${amount.toLocaleString('en-IN')})`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Helper function to get initials
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  React.useEffect(() => {
    if (open) {
      setIsDataLoading(true);
      if (college) {
        setIsDataLoading(false);
      } else {
        // If no college data, still show after a brief delay
        setTimeout(() => {
          setIsDataLoading(false);
        }, 500);
      }
    }
  }, [open, college]);

  // Helper function to safely get string values
  const getStringValue = (value: string | null | undefined): string => {
    return value || 'Not specified';
  };

  // Helper function to safely get array values
  const getArrayValue = (value: string[] | null | undefined): string[] => {
    return value || [];
  };

  // Handle college application
  const handleApply = async () => {
    if (!college || !user) return;

    setIsApplying(true);
    setApplyError(null);

    try {
      const applicationData = {
        studentId: user.studentId || user.userId,
        studentName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName || 'Student',
        applicationType: 'COLLEGE' as 'COLLEGE',
        applicationTitle: `Application for ${college.name}`,
        applicationDetails: `Student applying for admission to ${college.name} (${college.type}) in ${college.state}. College offers courses in ${getArrayValue(college.coursesOffered).join(', ') || 'various fields'}.`,
      };

      createApplication(
        {
          resource: 'applications',
          values: applicationData,
        },
        {
          onSuccess: () => {
            setApplySuccess(true);
            setIsApplying(false);
          },
          onError: (error) => {
            console.error('Application failed:', error);
            setApplyError('Failed to submit application. Please try again.');
            setIsApplying(false);
          },
        }
      );
    } catch (error) {
      console.error('Application error:', error);
      setApplyError('Failed to submit application. Please try again.');
      setIsApplying(false);
    }
  };

  if (!college && !isDataLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, gap: 2 }}>
            <Typography variant="h6" color="error">
              College not found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The requested college information could not be loaded.
            </Typography>
            <Button onClick={onClose} variant="outlined">
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  // Hide inactive colleges from students
  if (isStudent && college && !college.isActive) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, gap: 2 }}>
            <Typography variant="h6" color="error">
              College not found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The requested college information could not be loaded.
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
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={600}>
            College Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 0 }}>
        {isDataLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Loading college details...
            </Typography>
          </Box>
        ) : college ? (
          <Box sx={{ p: 3 }}>
            {/* College Header */}
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  mr: 3,
                }}
              >
                {college.image ? (
                  <img 
                    src={college.image} 
                    alt="College" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  getInitials(college.name)
                )}
              </Avatar>
              <Box flex={1}>
                <Typography variant="h4" gutterBottom>
                  {college.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {college.type} • Est. {college.establishedYear} • {college.city}, {college.state}
                </Typography>
                {college.rating && (
                  <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                    <Rating value={college.rating} readOnly size="small" />
                    <Typography variant="body2">({college.rating})</Typography>
                  </Box>
                )}
              </Box>
              <Chip
                label={college.isActive ? 'Active' : 'Inactive'}
                color={college.isActive ? 'success' : 'error'}
                variant="outlined"
              />
            </Box>

            {/* Basic Information - Same structure as Create */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  College Name
                </Typography>
                <Typography variant="body1">{college.name}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  College Type
                </Typography>
                <Typography variant="body1">{college.type}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  College Program
                </Typography>
                <Typography variant="body1">{college.Program}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  State
                </Typography>
                <Typography variant="body1">{college.state}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  City
                </Typography>
                <Typography variant="body1">{getStringValue(college.city)}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  District
                </Typography>
                <Typography variant="body1">{getStringValue(college.district)}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Established Year
                </Typography>
                <Typography variant="body1">{college.establishedYear || 'Not specified'}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Phone
                </Typography>
                <Typography variant="body1">{getStringValue(college.phone)}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Fees
                </Typography>
                <Typography variant="body1">
                  {college.fees ? 
                    (() => {
                      const amount = parseFloat(college.fees);
                      if (isNaN(amount)) return college.fees;
                      const lakhs = amount / 100000;
                      if (lakhs >= 1) {
                        return `₹${lakhs.toFixed(1)} lakhs (${amount.toLocaleString('en-IN')})`;
                      } else {
                        return `₹${amount.toLocaleString('en-IN')}`;
                      }
                    })() : 
                    'Not specified'
                  }
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Affiliation
                </Typography>
                <Typography variant="body1">{getStringValue(college.affiliation)}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Accreditation
                </Typography>
                <Typography variant="body1">{getStringValue(college.accreditation)}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Address
                </Typography>
                <Typography variant="body1">{getStringValue(college.address)}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">{getStringValue(college.description)}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Image URL
                </Typography>
                <Typography variant="body1">{getStringValue(college.image)}</Typography>
              </Box>

              {/* Academic Information Section */}
              <Divider sx={{ my: 2 }}>
                <Typography variant="h6" color="primary">
                  Academic Information
                </Typography>
              </Divider>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Courses Offered
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {getArrayValue(college.coursesOffered).length ? (
                      getArrayValue(college.coursesOffered).map((course, index) => (
                        <Chip key={index} label={course} variant="outlined" size="small" />
                      ))
                    ) : (
                      <Typography variant="body2">Not specified</Typography>
                    )}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Entrance Exams
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {getArrayValue(college.entranceExams).length ? (
                      getArrayValue(college.entranceExams).map((exam, index) => (
                        <Chip key={index} label={exam} variant="outlined" size="small" />
                      ))
                    ) : (
                      <Typography variant="body2">Not specified</Typography>
                    )}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Cutoff Percentile
                  </Typography>
                  <Typography variant="body1">{college.cutoffPercentile || 'Not specified'}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Minimum Percentage
                  </Typography>
                  <Typography variant="body1">{college.minimumPercentage ? `${college.minimumPercentage}%` : 'Not specified'}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Application Deadline
                  </Typography>
                  <Typography variant="body1">{formatDate(college.applicationDeadline)}</Typography>
                </Box>
              </Box>

              {/* Financial Information Section */}
              <Divider sx={{ my: 2 }}>
                <Typography variant="h6" color="primary">
                  Financial Information
                </Typography>
              </Divider>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Tuition Fee (Yearly)
                  </Typography>
                  <Typography variant="body1">{formatCurrency(college.tuitionFeeYearly)}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Hostel Fee (Yearly)
                  </Typography>
                  <Typography variant="body1">{formatCurrency(college.hostelFeeYearly)}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Fee (Yearly)
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{formatCurrency(college.totalFeeYearly)}</Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Scholarships Available
                    </Typography>
                    <Typography variant="body1">{college.scholarshipsAvailable ? 'Yes' : 'No'}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Loan Facilities
                    </Typography>
                    <Typography variant="body1">{college.loanFacilities ? 'Yes' : 'No'}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Infrastructure & Facilities Section */}
              <Divider sx={{ my: 2 }}>
                <Typography variant="h6" color="primary">
                  Infrastructure & Facilities
                </Typography>
              </Divider>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Campus Size (Acres)
                  </Typography>
                  <Typography variant="body1">{college.campusSizeAcres ? `${college.campusSizeAcres} acres` : 'Not specified'}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Library Books Count
                  </Typography>
                  <Typography variant="body1">{college.libraryBooksCount ? college.libraryBooksCount.toLocaleString() : 'Not specified'}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Laboratories Count
                  </Typography>
                  <Typography variant="body1">{college.laboratoriesCount || 'Not specified'}</Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Hostel Facility
                    </Typography>
                    <Typography variant="body1">{college.hostelFacility ? 'Available' : 'Not available'}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      WiFi Facility
                    </Typography>
                    <Typography variant="body1">{college.wifiFacility ? 'Available' : 'Not available'}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Student Statistics & Placement Section */}
              <Divider sx={{ my: 2 }}>
                <Typography variant="h6" color="primary">
                  Student Statistics & Placement
                </Typography>
              </Divider>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Students
                  </Typography>
                  <Typography variant="body1">{college.totalStudents ? college.totalStudents.toLocaleString() : 'Not specified'}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Faculty Count
                  </Typography>
                  <Typography variant="body1">{college.facultyCount || 'Not specified'}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Placement Percentage
                  </Typography>
                  <Typography variant="body1">{college.placementPercentage ? `${college.placementPercentage}%` : 'Not specified'}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Average Salary (₹)
                  </Typography>
                  <Typography variant="body1">{formatCurrency(college.averageSalary)}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Top Recruiters
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {getArrayValue(college.topRecruiters).length ? (
                      getArrayValue(college.topRecruiters).map((recruiter, index) => (
                        <Chip key={index} label={recruiter} variant="outlined" size="small" />
                      ))
                    ) : (
                      <Typography variant="body2">Not specified</Typography>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Status Section */}
              <Divider sx={{ my: 2 }}>
                <Typography variant="h6" color="primary">
                  Status
                </Typography>
              </Divider>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Rating:
                </Typography>
                <Rating value={college.rating || 0} readOnly />
                <Typography variant="body2">({college.rating || 0})</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Typography variant="body1">{college.isActive ? 'Active' : 'Inactive'}</Typography>
              </Box>
            </Box>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'space-between' }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
          {isStudent && college && (
            <Button
              onClick={handleApply}
              variant="contained"
              startIcon={<SendIcon />}
              disabled={isApplying}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {isApplying ? 'Applying...' : 'Apply Now'}
            </Button>
          )}
        </Box>
      </DialogActions>

      {/* Success Notification */}
      <Snackbar
        open={applySuccess}
        autoHideDuration={6000}
        onClose={() => setApplySuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setApplySuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Application submitted successfully! You will be notified about the status.
        </Alert>
      </Snackbar>

      {/* Error Notification */}
      <Snackbar
        open={!!applyError}
        autoHideDuration={6000}
        onClose={() => setApplyError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setApplyError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {applyError}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ViewDetails;