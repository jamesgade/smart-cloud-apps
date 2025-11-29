import React, { useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, Button, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useAuthModal } from '../contexts/AuthModalContext';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import EngineeringIcon from '@mui/icons-material/Engineering';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Partner College Images
import itmImg from '../assets/partnered-colleges/itm_uni.jpeg';
import kaveriImg from '../assets/partnered-colleges/kaveri_telangana.jpg';
import srinidhiImg from '../assets/partnered-colleges/srinidhi_hyderabad.png';
import upesImg from '../assets/partnered-colleges/upes_dehradun.jpg';
import bharathImg from '../assets/partnered-colleges/bharath_chennai.jpg';
import drMgrImg from '../assets/partnered-colleges/dr_mgr_chennai.jpg';
import amityImg from '../assets/partnered-colleges/amrita_coimbatore.jpg';

const CollegesPage = () => {
  const { openLogin } = useAuthModal();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');
  const [filterLocation, setFilterLocation] = React.useState('all');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const allColleges = [
    {
      name: "ITM University",
      fullName: "ITM University",
      location: "Gwalior, Madhya Pradesh",
      type: "University",
      rating: 4.0,
      courses: ["B.Tech", "MBA", "MCA", "M.Tech"],
      fees: "Scholarship Available",
      students: "5000+",
      established: "1997",
      icon: <SchoolIcon />,
      color: "#FF6B35",
      rank: "Top University",
      image: itmImg,
      locationKey: "madhya-pradesh"
    },
    {
      name: "Kaveri University",
      fullName: "Kaveri University",
      location: "Telangana",
      type: "Engineering",
      rating: 4.0,
      courses: ["B.Tech", "M.Tech", "CSE", "ECE"],
      fees: "Scholarship Available",
      students: "1500+",
      established: "2018",
      icon: <EngineeringIcon />,
      color: "#FF8C42",
      rank: "Engineering College",
      image: kaveriImg,
      locationKey: "telangana"
    },
    {
      name: "Srinidhi University",
      fullName: "Srinidhi University",
      location: "Hyderabad, Telangana",
      type: "Multi-disciplinary",
      rating: 4.2,
      courses: ["B.Tech", "MBA", "BBA", "M.Tech"],
      fees: "Scholarship Available",
      students: "3000+",
      established: "2010",
      icon: <SchoolIcon />,
      color: "#F7931E",
      rank: "Top University",
      image: srinidhiImg,
      locationKey: "telangana"
    },
    {
      name: "UPES University",
      fullName: "UPES University",
      location: "Dehradun, Uttarakhand",
      type: "Multi-disciplinary",
      rating: 4.4,
      courses: ["B.Tech", "MBA", "BBA", "LLB"],
      fees: "Scholarship Available",
      students: "15000+",
      established: "2003",
      icon: <SchoolIcon />,
      color: "#FF6B35",
      rank: "Top University",
      image: upesImg,
      locationKey: "uttarakhand"
    },
    {
      name: "Bharath University",
      fullName: "Bharath University",
      location: "Chennai, Tamil Nadu",
      type: "Multi-disciplinary",
      rating: 4.3,
      courses: ["B.Tech", "MBBS", "MBA", "B.Sc"],
      fees: "Scholarship Available",
      students: "12000+",
      established: "1984",
      icon: <SchoolIcon />,
      color: "#FF8C42",
      rank: "Top University",
      image: bharathImg,
      locationKey: "tamil-nadu"
    },
    {
      name: "Dr. MGR University",
      fullName: "Dr. MGR University",
      location: "Chennai, Tamil Nadu",
      type: "Medical & Engineering",
      rating: 4.5,
      courses: ["MBBS", "B.Tech", "MBA", "BDS"],
      fees: "Scholarship Available",
      students: "20000+",
      established: "1987",
      icon: <LocalHospitalIcon />,
      color: "#F7931E",
      rank: "Top Medical University",
      image: drMgrImg,
      locationKey: "tamil-nadu"
    },
    {
      name: "Amity University",
      fullName: "Amity University",
      location: "Noida, Uttar Pradesh",
      type: "Multi-disciplinary",
      rating: 4.6,
      courses: ["B.Tech", "MBA", "LLB", "B.Sc"],
      fees: "Scholarship Available",
      students: "30000+",
      established: "2005",
      icon: <SchoolIcon />,
      color: "#FF6B35",
      rank: "Top Private University",
      image: amityImg,
      locationKey: "uttar-pradesh"
    },
  ];

  // Filter colleges based on search and filters
  const filteredColleges = allColleges.filter((college) => {
    // Search filter
    const matchesSearch = searchTerm === '' ||
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.courses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()));

    // Type filter
    const matchesType = filterType === 'all' || college.type.toLowerCase().includes(filterType.toLowerCase());

    // Location filter
    const matchesLocation = filterLocation === 'all' || college.locationKey === filterLocation;

    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 8 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            fontWeight="900"
            color="black"
            sx={{
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Partner Colleges & Universities
          </Typography>
          <Typography
            variant="h6"
            color="#666"
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              lineHeight: 1.6
            }}
          >
            Explore our partnered institutions offering exclusive scholarships and quality education across India.
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 6, backgroundColor: 'white', p: 4, borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Search colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#FF6B35' }} />
                      </InputAdornment>
                    ),
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#FF6B35',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF6B35',
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  label="Type"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="university">University</MenuItem>
                  <MenuItem value="engineering">Engineering</MenuItem>
                  <MenuItem value="medical">Medical</MenuItem>
                  <MenuItem value="multi-disciplinary">Multi-disciplinary</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={filterLocation}
                  label="Location"
                  onChange={(e) => setFilterLocation(e.target.value)}
                >
                  <MenuItem value="all">All Locations</MenuItem>
                  <MenuItem value="tamil-nadu">Tamil Nadu</MenuItem>
                  <MenuItem value="telangana">Telangana</MenuItem>
                  <MenuItem value="madhya-pradesh">Madhya Pradesh</MenuItem>
                  <MenuItem value="uttarakhand">Uttarakhand</MenuItem>
                  <MenuItem value="uttar-pradesh">Uttar Pradesh</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* College Cards */}
        {filteredColleges.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="textSecondary" gutterBottom>
              No colleges found
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              Try adjusting your search or filters
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterLocation('all');
              }}
              sx={{
                borderColor: '#FF6B35',
                color: '#FF6B35',
                '&:hover': {
                  borderColor: '#FF6B35',
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                }
              }}
            >
              Clear Filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredColleges.map((college, index) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  minHeight: '500px',
                  borderRadius: '24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 107, 53, 0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                    border: `2px solid ${college.color}`,
                    backgroundColor: 'rgba(255, 255, 255, 1)'
                  }
                }}
              >
                {/* College Image - Full Width at Top */}
                <Box
                  sx={{
                    width: '100%',
                    height: '200px',
                    overflow: 'hidden',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '60px',
                      background: `linear-gradient(to top, rgba(0,0,0,0.3), transparent)`
                    }
                  }}
                >
                  <img
                    src={college.image}
                    alt={college.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {/* Rank Badge on Image */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 2
                    }}
                  >
                    <Chip
                      label={college.rank}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        color: college.color,
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        height: '28px',
                        border: `2px solid ${college.color}`,
                        '& .MuiChip-label': {
                          padding: '0 12px'
                        }
                      }}
                    />
                  </Box>
                </Box>

                <CardContent sx={{
                  p: 3,
                  flex: '1 1 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:last-child': { pb: 3 }
                }}>
                  {/* College Name */}
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="black"
                    sx={{
                      mb: 2,
                      fontSize: '1.5rem'
                    }}
                  >
                    {college.name}
                  </Typography>

                  {/* College Info */}
                  <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon sx={{ fontSize: 18, color: '#666', mr: 1 }} />
                      <Typography variant="body2" color="#666">
                        {college.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PeopleIcon sx={{ fontSize: 18, color: '#666', mr: 1 }} />
                        <Typography variant="body2" color="#666">
                          {college.students} Students
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="#666">
                        Est. {college.established}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StarIcon sx={{ fontSize: 18, color: '#FFD700', mr: 0.5 }} />
                      <Typography variant="body2" color="black" fontWeight="bold">
                        {college.rating} / 5.0
                      </Typography>
                    </Box>
                  </Box>

                  {/* Courses */}
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="black" sx={{ mb: 1.5 }}>
                      Popular Courses:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {college.courses.slice(0, 4).map((course, idx) => (
                        <Chip
                          key={idx}
                          label={course}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.75rem',
                            height: '28px',
                            borderColor: `${college.color}40`,
                            color: college.color,
                            backgroundColor: `${college.color}10`,
                            fontWeight: '600',
                            '&:hover': {
                              backgroundColor: `${college.color}20`,
                              borderColor: college.color
                            }
                          }}
                        />
                      ))}
                      {college.courses.length > 4 && (
                        <Chip
                          label={`+${college.courses.length - 4} more`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.75rem',
                            height: '28px',
                            borderColor: `${college.color}40`,
                            color: college.color,
                            backgroundColor: `${college.color}10`,
                            fontWeight: '600'
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Button
                      fullWidth
                      endIcon={<ArrowForwardIcon />}
                      onClick={openLogin}
                      sx={{
                        background: `linear-gradient(135deg, ${college.color} 0%, ${college.color}CC 100%)`,
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        py: 1.5,
                        fontSize: '1rem',
                        textTransform: 'none',
                        '&:hover': {
                          background: `linear-gradient(135deg, ${college.color}EE 0%, ${college.color} 100%)`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 12px 30px ${college.color}40`
                        }
                      }}
                    >
                      Apply for Scholarship
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        )}
      </Container>
    </Box>
  );
};

export default CollegesPage;

