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
  School as SchoolIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckIcon,
  OpenInNew as ExternalLinkIcon,
} from '@mui/icons-material';
import axiosInstance from '../../libs/axiosInstance';
import { API_BASE_URL } from '../../libs/constants';
import { applicationService } from '../../services/applicationService';
import { useGetIdentity } from '@refinedev/core';

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

const StudentScholarshipsList: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  const { data: identity } = useGetIdentity();

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`${API_BASE_URL}/scholarships?limit=100`);
      setScholarships(response.data.data || []);
    } catch (err) {
      setError('Failed to load scholarships. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForScholarship = async (scholarship: Scholarship) => {
    if (!identity?.studentId && !identity?.userId && !identity?.sub) {
      setError('Student information not found. Please try again.');
      return;
    }

    try {
      setApplying(scholarship.scholarshipId);
      setError(null);

      await applicationService.createApplication({
        studentId: identity.studentId || identity.userId || identity.sub,
        studentName: identity.firstName + ' ' + identity.lastName,
        applicationType: 'SCHOLARSHIP',
        applicationTitle: scholarship.scholarshipName,
        applicationDetails: `Provider: ${scholarship.provider}, Amount: ${scholarship.scholarshipAmount ? `₹${scholarship.scholarshipAmount.toLocaleString()}` : 'Not specified'}, Education Level: ${scholarship.educationLevel || 'Not specified'}, Benefits: ${scholarship.benefitsDescription || 'Not specified'}${scholarship.portalLink ? `, Portal Link: ${scholarship.portalLink}` : ''}`,
      });

      alert(`Application submitted successfully for ${scholarship.scholarshipName} scholarship!`);
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isApplicationOpen = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return null;
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'closed';
    return 'open';
  };

  const renderApplicationStatus = (scholarship: Scholarship) => {
    const status = isApplicationOpen(scholarship.applicationStartDate, scholarship.applicationEndDate);
    if (!status) return 'Not specified';
    
    return (
      <Chip
        label={
          status === 'open' ? 'Open' :
          status === 'upcoming' ? 'Upcoming' : 'Closed'
        }
        size="small"
        color={
          status === 'open' ? 'success' :
          status === 'upcoming' ? 'warning' : 'error'
        }
        variant="filled"
      />
    );
  };

  const renderApplicationPeriod = (scholarship: Scholarship) => {
    if (!scholarship.applicationStartDate || !scholarship.applicationEndDate) {
      return 'Not specified';
    }
    return `${formatDate(scholarship.applicationStartDate)} - ${formatDate(scholarship.applicationEndDate)}`;
  };

  const renderScholarshipCard = (scholarship: Scholarship) => {
    const applicationStatus = isApplicationOpen(scholarship.applicationStartDate, scholarship.applicationEndDate);
    
    return (
      <Card key={scholarship.scholarshipId} sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SchoolIcon sx={{ color: '#FF6B35', mr: 1, fontSize: 24 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 0.5 }}>
                {scholarship.scholarshipName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                by {scholarship.provider}
              </Typography>
            </Box>
          </Box>

          {/* Scholarship Amount */}
          {scholarship.scholarshipAmount && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Scholarship Amount
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2E7D32' }}>
                {formatCurrency(scholarship.scholarshipAmount)}
              </Typography>
            </Box>
          )}

          {/* Education Level */}
          {scholarship.educationLevel && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Education Level
              </Typography>
              <Chip
                label={scholarship.educationLevel}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          )}

          {/* Application Status */}
          {applicationStatus && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Application Status
              </Typography>
              <Chip
                label={
                  applicationStatus === 'open' ? 'Open' :
                  applicationStatus === 'upcoming' ? 'Upcoming' : 'Closed'
                }
                size="small"
                color={
                  applicationStatus === 'open' ? 'success' :
                  applicationStatus === 'upcoming' ? 'warning' : 'error'
                }
                variant="filled"
              />
            </Box>
          )}

          {/* Application Dates */}
          {(scholarship.applicationStartDate || scholarship.applicationEndDate) && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Application Period
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon sx={{ color: '#666', fontSize: 16 }} />
                <Typography variant="body2">
                  {formatDate(scholarship.applicationStartDate)} - {formatDate(scholarship.applicationEndDate)}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Applicable Courses */}
          {scholarship.applicableCourses && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Applicable Courses
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                {scholarship.applicableCourses}
              </Typography>
            </Box>
          )}

          {/* Benefits Description */}
          {scholarship.benefitsDescription && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Benefits
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {scholarship.benefitsDescription}
              </Typography>
            </Box>
          )}

          {/* Portal Link */}
          {scholarship.portalLink && (
            <>
              <Divider sx={{ my: 2 }} />
              <Button
                variant="outlined"
                size="small"
                endIcon={<ExternalLinkIcon />}
                onClick={() => window.open(scholarship.portalLink, '_blank')}
                sx={{
                  borderColor: '#FF6B35',
                  color: '#FF6B35',
                  '&:hover': {
                    borderColor: '#FF6B35',
                    backgroundColor: 'rgba(255, 107, 53, 0.08)',
                  },
                }}
              >
                Apply Now
              </Button>
            </>
          )}

          {/* Overall Remarks */}
          {scholarship.overallRemarks && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Additional Information
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                  {scholarship.overallRemarks}
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    );
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
          Scholarships
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover available scholarships and financial aid opportunities for your education
        </Typography>
      </Box>

      {/* Scholarships Table */}
      {scholarships.length > 0 ? (
        <Card>
          <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>Scholarship</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Provider</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Education Level</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>Application Period</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scholarships.map((scholarship) => (
                  <TableRow key={scholarship.scholarshipId} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SchoolIcon sx={{ color: '#FF6B35', mr: 1, fontSize: 20 }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {scholarship.scholarshipName}
                          </Typography>
                          {scholarship.applicableCourses && (
                            <Typography variant="caption" color="text.secondary">
                              {scholarship.applicableCourses}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {scholarship.provider}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {scholarship.scholarshipAmount ? (
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#2E7D32' }}>
                          {formatCurrency(scholarship.scholarshipAmount)}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Not specified
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {scholarship.educationLevel ? (
                        <Chip
                          label={scholarship.educationLevel}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Not specified
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {renderApplicationStatus(scholarship)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {renderApplicationPeriod(scholarship)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={applying === scholarship.scholarshipId}
                        sx={{
                          borderColor: '#FF6B35',
                          color: '#FF6B35',
                          '&:hover': {
                            borderColor: '#FF6B35',
                            backgroundColor: 'rgba(255, 107, 53, 0.08)',
                          },
                        }}
                        onClick={() => handleApplyForScholarship(scholarship)}
                      >
                        {applying === scholarship.scholarshipId ? (
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
          <SchoolIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
            No scholarships available
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check back later for available scholarship opportunities
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default StudentScholarshipsList;
