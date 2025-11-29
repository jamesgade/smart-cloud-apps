import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Autocomplete,
  TextField,
  Grid,
  Chip,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
  Stack,
  Rating,
} from '@mui/material';
import {
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Star as StarIcon,
  Close as CloseIcon,
  CompareArrows as CompareIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Home as HomeIcon,
  LibraryBooks as LibraryIcon,
  Science as ScienceIcon,
  Wifi as WifiIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Work as WorkIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import { collegeService, College } from '../../services/collegeService';

interface SelectedCollege extends College {
  isSelected?: boolean;
}

const CollegeCompare: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedColleges, setSelectedColleges] = useState<SelectedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Load colleges on component mount
  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await collegeService.getColleges({ limit: 100 });
      setColleges(response.data || []);
    } catch (err) {
      setError('Failed to load colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCollegeSelect = (college: College | null) => {
    if (!college) return;

    // Check if college is already selected
    if (selectedColleges.some(c => c.collegeId === college.collegeId)) {
      return;
    }

    // Check if we already have 3 colleges selected
    if (selectedColleges.length >= 3) {
      setError('You can compare up to 3 colleges at a time.');
      return;
    }

    setSelectedColleges(prev => [...prev, { ...college, isSelected: true }]);
    setError(null);
  };

  const handleRemoveCollege = (collegeId: string) => {
    setSelectedColleges(prev => prev.filter(c => c.collegeId !== collegeId));
    setError(null);
  };

  const handleClearAll = () => {
    setSelectedColleges([]);
    setError(null);
  };

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

  // Helper function to safely get string values
  const getStringValue = (value: string | null | undefined): string => {
    return value || 'Not specified';
  };

  // Helper function to safely get array values
  const getArrayValue = (value: string[] | null | undefined): string[] => {
    return value || [];
  };

  const renderCollegeCard = (college: SelectedCollege, index: number) => (
    <Card key={college.collegeId} sx={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Remove button */}
      <IconButton
        onClick={() => handleRemoveCollege(college.collegeId)}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
        }}
        size="small"
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <CardContent sx={{ p: 3, flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', height: '100%', minHeight: '800px', maxHeight: '800px' }}>
        {/* College Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={college.image || ''}
            sx={{
              width: 60,
              height: 60,
              mr: 2,
              backgroundColor: '#FF6B35',
            }}
          >
            <SchoolIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 0.5 }}>
              {college.name || 'Unknown College'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {college.type || 'Unknown Type'}
            </Typography>
          </Box>
        </Box>

        {/* Rating */}
        {college.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={college.rating} readOnly precision={0.1} size="small" sx={{ mr: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {college.rating}/5.0
            </Typography>
          </Box>
        )}

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationIcon sx={{ color: '#666', mr: 1, fontSize: 18 }} />
          <Typography variant="body2" color="text.secondary">
            {getStringValue(college.city)}, {getStringValue(college.state)}
            {college.district && `, ${getStringValue(college.district)}`}
          </Typography>
        </Box>

        {/* Basic Information Section */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: 'primary.main' }}>
          Basic Information
        </Typography>

        {college.establishedYear && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Established:</strong> {college.establishedYear}
            </Typography>
          </Box>
        )}

        {college.affiliation && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Affiliation:</strong> {getStringValue(college.affiliation)}
            </Typography>
          </Box>
        )}

        {college.accreditation && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Accreditation:</strong> {getStringValue(college.accreditation)}
            </Typography>
          </Box>
        )}

        {/* Academic Information Section */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <BookIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Academic Information
          </Typography>
        </Box>

        {getArrayValue(college.coursesOffered).length > 0 && (
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Courses Offered:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {getArrayValue(college.coursesOffered).map((course, idx) => (
                <Chip key={idx} label={course} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
        )}

        {getArrayValue(college.entranceExams).length > 0 && (
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Entrance Exams:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {getArrayValue(college.entranceExams).map((exam, idx) => (
                <Chip key={idx} label={exam} size="small" color="primary" variant="outlined" />
              ))}
            </Box>
          </Box>
        )}

        {college.cutoffPercentile && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Cutoff Percentile:</strong> {college.cutoffPercentile}%
            </Typography>
          </Box>
        )}

        {college.minimumPercentage && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Minimum Percentage:</strong> {college.minimumPercentage}%
            </Typography>
          </Box>
        )}

        {college.applicationDeadline && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarIcon sx={{ color: '#666', mr: 1, fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              <strong>Application Deadline:</strong> {new Date(college.applicationDeadline).toLocaleDateString()}
            </Typography>
          </Box>
        )}

        {/* Financial Information Section */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <MoneyIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Financial Information
          </Typography>
        </Box>

        {college.fees && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Fees:</strong> {getStringValue(college.fees)}
            </Typography>
          </Box>
        )}

        {college.tuitionFeeYearly && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Tuition Fee (Yearly):</strong> {formatCurrency(college.tuitionFeeYearly)}
            </Typography>
          </Box>
        )}

        {college.hostelFeeYearly && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Hostel Fee (Yearly):</strong> {formatCurrency(college.hostelFeeYearly)}
            </Typography>
          </Box>
        )}

        {college.totalFeeYearly && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Total Fee (Yearly):</strong> {formatCurrency(college.totalFeeYearly)}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          {college.scholarshipsAvailable !== undefined && (
            <Chip
              icon={college.scholarshipsAvailable ? <CheckCircleIcon /> : <CancelIcon />}
              label={college.scholarshipsAvailable ? 'Scholarships Available' : 'No Scholarships'}
              size="small"
              color={college.scholarshipsAvailable ? 'success' : 'default'}
              variant="outlined"
            />
          )}
          {college.loanFacilities !== undefined && (
            <Chip
              icon={college.loanFacilities ? <CheckCircleIcon /> : <CancelIcon />}
              label={college.loanFacilities ? 'Loan Facilities' : 'No Loan Facilities'}
              size="small"
              color={college.loanFacilities ? 'success' : 'default'}
              variant="outlined"
            />
          )}
        </Box>

        {/* Infrastructure & Facilities Section */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: 'primary.main' }}>
          Infrastructure & Facilities
        </Typography>

        {college.campusSizeAcres && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SchoolIcon sx={{ color: '#666', mr: 1, fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              <strong>Campus Size:</strong> {college.campusSizeAcres} acres
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {college.hostelFacility !== undefined && (
            <Chip
              icon={college.hostelFacility ? <HomeIcon /> : <CancelIcon />}
              label={college.hostelFacility ? 'Hostel Available' : 'No Hostel'}
              size="small"
              color={college.hostelFacility ? 'success' : 'default'}
              variant="outlined"
            />
          )}
          {college.wifiFacility !== undefined && (
            <Chip
              icon={college.wifiFacility ? <WifiIcon /> : <CancelIcon />}
              label={college.wifiFacility ? 'WiFi Available' : 'No WiFi'}
              size="small"
              color={college.wifiFacility ? 'success' : 'default'}
              variant="outlined"
            />
          )}
        </Box>

        {college.libraryBooksCount && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LibraryIcon sx={{ color: '#666', mr: 1, fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              <strong>Library Books:</strong> {college.libraryBooksCount.toLocaleString()}
            </Typography>
          </Box>
        )}

        {college.laboratoriesCount && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ScienceIcon sx={{ color: '#666', mr: 1, fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              <strong>Laboratories:</strong> {college.laboratoriesCount}
            </Typography>
          </Box>
        )}

        {/* Student Statistics & Placement Section */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <TrendingUpIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Student Statistics & Placement
          </Typography>
        </Box>

        {college.totalStudents && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PeopleIcon sx={{ color: '#666', mr: 1, fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              <strong>Total Students:</strong> {college.totalStudents.toLocaleString()}
            </Typography>
          </Box>
        )}

        {college.facultyCount && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PeopleIcon sx={{ color: '#666', mr: 1, fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              <strong>Faculty:</strong> {college.facultyCount.toLocaleString()}
            </Typography>
          </Box>
        )}

        {college.placementPercentage && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Placement Percentage:</strong> {college.placementPercentage}%
            </Typography>
          </Box>
        )}

        {college.averageSalary && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Average Salary:</strong> {formatCurrency(college.averageSalary)}
            </Typography>
          </Box>
        )}

        {getArrayValue(college.topRecruiters).length > 0 && (
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Top Recruiters:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {getArrayValue(college.topRecruiters).map((recruiter, idx) => (
                <Chip key={idx} label={recruiter} size="small" color="secondary" variant="outlined" />
              ))}
            </Box>
          </Box>
        )}

        {/* Contact Information */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Contact Information
        </Typography>
        
        {college.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <PhoneIcon sx={{ color: '#666', mr: 1, fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {getStringValue(college.phone)}
            </Typography>
          </Box>
        )}

        {college.email && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <EmailIcon sx={{ color: '#666', mr: 1, fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {getStringValue(college.email)}
            </Typography>
          </Box>
        )}

        {college.website && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <WebsiteIcon sx={{ color: '#666', mr: 1, fontSize: 16 }} />
            <Typography 
              variant="body2" 
              color="primary"
              sx={{ 
                textDecoration: 'underline',
                cursor: 'pointer',
                '&:hover': { color: '#FF6B35' }
              }}
              onClick={() => window.open(college.website, '_blank')}
            >
              Visit Website
            </Typography>
          </Box>
        )}

        {college.address && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {getStringValue(college.address)}
            </Typography>
          </Box>
        )}

        {/* Description */}
        {college.description && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                About
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  lineHeight: 1.6,
                }}
              >
                {getStringValue(college.description)}
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
          Compare Colleges
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Select up to 3 colleges to compare their details side by side
        </Typography>
      </Box>

      {/* College Selection */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Autocomplete
            options={colleges.filter(college => 
              !selectedColleges.some(selected => selected.collegeId === college.collegeId)
            )}
            getOptionLabel={(option) => option.name || 'Unknown College'}
            onChange={(_, value) => handleCollegeSelect(value)}
            loading={searchLoading}
            freeSolo={false}
            disableClearable={false}
            sx={{ minWidth: 300, flex: 1 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search and select colleges"
                placeholder="Type college name..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Avatar
                    src={option.image || ''}
                    sx={{ width: 32, height: 32, mr: 2, backgroundColor: '#FF6B35' }}
                  >
                    <SchoolIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {option.name || 'Unknown College'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.city || 'Unknown City'}, {option.state || 'Unknown State'} • {option.type || 'Unknown Type'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          />

          {selectedColleges.length > 0 && (
            <Button
              variant="outlined"
              onClick={handleClearAll}
              startIcon={<CloseIcon />}
              sx={{
                borderColor: '#FF6B35',
                color: '#FF6B35',
                '&:hover': {
                  borderColor: '#FF6B35',
                  backgroundColor: 'rgba(255, 107, 53, 0.08)',
                },
              }}
            >
              Clear All
            </Button>
          )}
        </Box>

        {/* Selected Colleges Count */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Selected: {selectedColleges.length}/3 colleges
          </Typography>
          {selectedColleges.length > 0 && (
            <Chip
              icon={<CompareIcon />}
              label={`Compare ${selectedColleges.length} College${selectedColleges.length > 1 ? 's' : ''}`}
              color="primary"
              size="small"
            />
          )}
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Comparison Grid */}
      {selectedColleges.length > 0 ? (
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'stretch' }}>
            {selectedColleges.map((college, index) => (
              <Grid 
                item 
                xs={12} 
                sm={6}
                md={4}
                lg={4}
                key={college.collegeId}
                sx={{
                  display: 'flex',
                  '@media (min-width: 960px)': {
                    flex: '1 1 calc(33.333% - 16px)',
                    maxWidth: 'calc(33.333% - 16px)',
                  },
                }}
              >
                {renderCollegeCard(college, index)}
              </Grid>
            ))}
            
            {/* Empty slots for visual balance */}
            {selectedColleges.length < 3 && (
              Array.from({ length: 3 - selectedColleges.length }).map((_, index) => (
                <Grid 
                  item 
                  xs={12}
                  sm={6}
                  md={4}
                  lg={4}
                  key={`empty-${index}`}
                  sx={{
                    display: 'flex',
                    '@media (min-width: 960px)': {
                      flex: '1 1 calc(33.333% - 16px)',
                      maxWidth: 'calc(33.333% - 16px)',
                    },
                  }}
                >
                  <Card sx={{ height: '100%', border: '2px dashed #ddd', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', width: '100%', minHeight: '800px' }}>
                    <CardContent sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexGrow: 1,
                      height: '100%',
                      minHeight: '800px'
                    }}>
                      <AddIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        Add College
                      </Typography>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        Select another college to compare
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      ) : (
        /* Empty State */
        <Paper sx={{ p: 6, textAlign: 'center', backgroundColor: '#fafafa' }}>
          <CompareIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
            No colleges selected
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Use the search box above to select colleges for comparison
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              const searchInput = document.querySelector('input[placeholder="Type college name..."]') as HTMLInputElement;
              searchInput?.focus();
            }}
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
              },
            }}
          >
            Start Comparing
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default CollegeCompare;
