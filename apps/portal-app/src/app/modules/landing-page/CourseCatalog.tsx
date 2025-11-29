import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router';
import { useAuthModal } from '../../contexts/AuthModalContext';
import EngineeringIcon from '@mui/icons-material/Engineering';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GavelIcon from '@mui/icons-material/Gavel';
import BusinessIcon from '@mui/icons-material/Business';
import ScienceIcon from '@mui/icons-material/Science';
import SchoolIcon from '@mui/icons-material/School';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const CourseCatalog = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { openLogin } = useAuthModal();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [currentCategory, setCurrentCategory] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const courseCategories = [
    {
      title: "Engineering & Technology",
      icon: <EngineeringIcon />,
      color: "#FF6B35",
      courses: [
        { name: "Computer Science Engineering", duration: "4 Years", eligibility: "10+2 with PCM", avgPackage: "₹8-15 LPA" },
        { name: "Mechanical Engineering", duration: "4 Years", eligibility: "10+2 with PCM", avgPackage: "₹6-12 LPA" },
        { name: "Electronics & Communication", duration: "4 Years", eligibility: "10+2 with PCM", avgPackage: "₹7-14 LPA" },
        { name: "Civil Engineering", duration: "4 Years", eligibility: "10+2 with PCM", avgPackage: "₹5-10 LPA" },
        { name: "Aerospace Engineering", duration: "4 Years", eligibility: "10+2 with PCM", avgPackage: "₹8-16 LPA" },
        { name: "Information Technology", duration: "4 Years", eligibility: "10+2 with PCM", avgPackage: "₹7-13 LPA" }
      ],
      totalColleges: "200+ Colleges",
      popularExams: ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE"]
    },
    {
      title: "Medical & Health Sciences",
      icon: <LocalHospitalIcon />,
      color: "#FF8C42",
      courses: [
        { name: "Bachelor of Medicine (MBBS)", duration: "5.5 Years", eligibility: "10+2 with PCB", avgPackage: "₹10-25 LPA" },
        { name: "Bachelor of Dental Surgery", duration: "5 Years", eligibility: "10+2 with PCB", avgPackage: "₹6-15 LPA" },
        { name: "Bachelor of Pharmacy", duration: "4 Years", eligibility: "10+2 with PCB", avgPackage: "₹4-8 LPA" },
        { name: "Bachelor of Physiotherapy", duration: "4.5 Years", eligibility: "10+2 with PCB", avgPackage: "₹4-10 LPA" },
        { name: "Bachelor of Nursing", duration: "4 Years", eligibility: "10+2 with PCB", avgPackage: "₹3-7 LPA" },
        { name: "Veterinary Science", duration: "5 Years", eligibility: "10+2 with PCB", avgPackage: "₹5-12 LPA" }
      ],
      totalColleges: "150+ Colleges",
      popularExams: ["NEET", "AIIMS", "JIPMER", "CMC Vellore"]
    },
    {
      title: "Management & Business",
      icon: <BusinessIcon />,
      color: "#F7931E",
      courses: [
        { name: "Bachelor of Business Administration", duration: "3 Years", eligibility: "10+2 Any Stream", avgPackage: "₹5-12 LPA" },
        { name: "Master of Business Administration", duration: "2 Years", eligibility: "Graduation", avgPackage: "₹8-25 LPA" },
        { name: "Bachelor of Commerce", duration: "3 Years", eligibility: "10+2 Commerce", avgPackage: "₹4-8 LPA" },
        { name: "Chartered Accountancy", duration: "4-5 Years", eligibility: "10+2 Commerce", avgPackage: "₹6-20 LPA" },
        { name: "Company Secretary", duration: "3-4 Years", eligibility: "10+2 Commerce", avgPackage: "₹4-12 LPA" },
        { name: "Digital Marketing", duration: "1-2 Years", eligibility: "10+2 Any Stream", avgPackage: "₹3-8 LPA" }
      ],
      totalColleges: "180+ Colleges",
      popularExams: ["CAT", "XAT", "MAT", "SNAP", "CMAT"]
    },
    {
      title: "Arts & Humanities",
      icon: <SchoolIcon />,
      color: "#FF6B35",
      courses: [
        { name: "Bachelor of Arts (BA)", duration: "3 Years", eligibility: "10+2 Any Stream", avgPackage: "₹3-6 LPA" },
        { name: "Bachelor of Fine Arts", duration: "4 Years", eligibility: "10+2 Any Stream", avgPackage: "₹4-8 LPA" },
        { name: "Journalism & Mass Communication", duration: "3 Years", eligibility: "10+2 Any Stream", avgPackage: "₹4-10 LPA" },
        { name: "Psychology", duration: "3 Years", eligibility: "10+2 Any Stream", avgPackage: "₹3-7 LPA" },
        { name: "English Literature", duration: "3 Years", eligibility: "10+2 Any Stream", avgPackage: "₹3-6 LPA" },
        { name: "History & Political Science", duration: "3 Years", eligibility: "10+2 Any Stream", avgPackage: "₹3-6 LPA" }
      ],
      totalColleges: "120+ Colleges",
      popularExams: ["CUET", "DU JAT", "BHU UET", "JMI Entrance"]
    },
    {
      title: "Law & Legal Studies",
      icon: <GavelIcon />,
      color: "#FF9800",
      courses: [
        { name: "Bachelor of Laws (LLB)", duration: "3 Years", eligibility: "Graduation", avgPackage: "₹5-15 LPA" },
        { name: "BA LLB (Integrated)", duration: "5 Years", eligibility: "10+2 Any Stream", avgPackage: "₹6-18 LPA" },
        { name: "Master of Laws (LLM)", duration: "1-2 Years", eligibility: "LLB", avgPackage: "₹8-25 LPA" },
        { name: "Diploma in Cyber Law", duration: "1 Year", eligibility: "Graduation", avgPackage: "₹4-10 LPA" },
        { name: "Corporate Law", duration: "2 Years", eligibility: "LLB", avgPackage: "₹10-30 LPA" },
        { name: "Criminal Law", duration: "1 Year", eligibility: "LLB", avgPackage: "₹6-20 LPA" }
      ],
      totalColleges: "80+ Colleges",
      popularExams: ["CLAT", "AILET", "LSAT", "SLAT"]
    },
    {
      title: "Science & Research",
      icon: <ScienceIcon />,
      color: "#FF9800",
      courses: [
        { name: "Bachelor of Science (B.Sc)", duration: "3 Years", eligibility: "10+2 Science", avgPackage: "₹3-7 LPA" },
        { name: "Bachelor of Technology (B.Tech)", duration: "4 Years", eligibility: "10+2 with PCM", avgPackage: "₹5-12 LPA" },
        { name: "Master of Science (M.Sc)", duration: "2 Years", eligibility: "B.Sc", avgPackage: "₹4-10 LPA" },
        { name: "Ph.D in Sciences", duration: "3-5 Years", eligibility: "M.Sc", avgPackage: "₹8-20 LPA" },
        { name: "Data Science", duration: "1-2 Years", eligibility: "10+2 with Math", avgPackage: "₹6-15 LPA" },
        { name: "Biotechnology", duration: "4 Years", eligibility: "10+2 with PCB", avgPackage: "₹4-10 LPA" }
      ],
      totalColleges: "100+ Colleges",
      popularExams: ["JEE Main", "NEET", "GATE", "JEST"]
    }
  ];

  const nextCategory = () => {
    setCurrentCategory((prev) => (prev + 1) % courseCategories.length);
  };

  const prevCategory = () => {
    setCurrentCategory((prev) => (prev - 1 + courseCategories.length) % courseCategories.length);
  };

  const goToCategory = (index: number) => {
    setCurrentCategory(index);
  };

  return (
    <Box id="course-catalog" sx={{ py: 10, backgroundColor: 'white' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom 
            fontWeight="900" 
            sx={{ 
              mb: 3, 
              color: 'black',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '-0.02em'
            }}
          >
            Complete Course Catalog
          </Typography>
          <Typography 
            variant="h6" 
            color="#666" 
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto', 
              mb: 4,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              lineHeight: 1.6,
              fontWeight: 400
            }}
          >
            Explore 100+ courses across 6 major streams. Find your passion and build a successful career with our comprehensive course catalog.
          </Typography>
        </Box>

        {/* Category Navigation */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color="black" 
            sx={{ 
              mb: 6, 
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Browse by Category
          </Typography>
          
          <Box sx={{ position: 'relative', px: { xs: 0, md: 10 } }}>
            {/* Navigation Buttons */}
            {!isMobile && (
              <>
                <IconButton
                  onClick={prevCategory}
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#FF6B35',
                    zIndex: 2,
                    border: '1px solid rgba(255, 107, 53, 0.2)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.1)',
                      transform: 'translateY(-50%) scale(1.1)'
                    }
                  }}
                >
                  <ArrowBackIosIcon />
                </IconButton>
                <IconButton
                  onClick={nextCategory}
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#FF6B35',
                    zIndex: 2,
                    border: '1px solid rgba(255, 107, 53, 0.2)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.1)',
                      transform: 'translateY(-50%) scale(1.1)'
                    }
                  }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </>
            )}

            {/* Category Tabs */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 2,
                px: { xs: 0, md: 6 },
                justifyContent: { xs: 'center', md: 'flex-start' },
                '&::-webkit-scrollbar': {
                  height: 6,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  borderRadius: 3,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#FF6B35',
                  borderRadius: 3,
                },
              }}
            >
              {courseCategories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === currentCategory ? 'contained' : 'outlined'}
                  onClick={() => goToCategory(index)}
                  startIcon={category.icon}
                  sx={{
                    minWidth: { xs: '200px', md: '250px' },
                    py: 2,
                    borderRadius: '12px',
                    backgroundColor: index === currentCategory ? category.color : 'transparent',
                    color: index === currentCategory ? 'white' : category.color,
                    borderColor: category.color,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    '&:hover': {
                      backgroundColor: index === currentCategory ? category.color : `${category.color}10`,
                      borderColor: category.color,
                    },
                    transition: 'all 0.3s ease',
                    flexShrink: 0
                  }}
                >
                  {category.title}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Current Category Content */}
        <Box>
          {courseCategories.map((category, categoryIndex) => (
            categoryIndex === currentCategory && (
              <Box key={categoryIndex}>
                {/* Category Header */}
                <Card
                  sx={{
                    mb: 6,
                    borderRadius: '24px',
                    backgroundColor: 'rgba(255, 107, 53, 0.05)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    border: `2px solid ${category.color}20`,
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{
                    p: 4,
                    background: `linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(255, 107, 53, 0.02) 100%)`,
                    borderBottom: `1px solid rgba(255, 107, 53, 0.1)`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          backgroundColor: category.color,
                          width: 60,
                          height: 60,
                          mr: 3,
                          '& svg': {
                            fontSize: '2rem',
                            color: 'white'
                          }
                        }}
                      >
                        {category.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h4" fontWeight="bold" color="black">
                          {category.title}
                        </Typography>
                        <Typography variant="h6" color="#666" sx={{ mt: 0.5 }}>
                          {category.totalColleges}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {category.popularExams.map((exam, examIndex) => (
                        <Chip
                          key={examIndex}
                          label={exam}
                          size="small"
                          sx={{
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                            fontWeight: 'bold',
                            '&:hover': {
                              backgroundColor: `${category.color}30`
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Courses Grid */}
                  <Box sx={{ p: 4 }}>
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)'
                      },
                      gap: 3
                    }}>
                      {category.courses.map((course, courseIndex) => (
                        <Card
                          key={courseIndex}
                          sx={{
                            height: '300px',
                            borderRadius: '16px',
                            backgroundColor: 'rgba(255, 107, 53, 0.05)',
                            border: `1px solid ${category.color}20`,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: `0 12px 40px ${category.color}30`,
                              border: `2px solid ${category.color}`,
                              backgroundColor: 'rgba(255, 107, 53, 0.1)'
                            }
                          }}
                        >
                            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                              <Typography variant="h6" fontWeight="bold" color="black" sx={{ mb: 2 }}>
                                {course.name}
                              </Typography>
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="#666" sx={{ mb: 0.5 }}>
                                  Duration: <strong>{course.duration}</strong>
                                </Typography>
                                <Typography variant="body2" color="#666" sx={{ mb: 0.5 }}>
                                  Eligibility: <strong>{course.eligibility}</strong>
                                </Typography>
                                <Typography variant="body2" color="#666">
                                  Avg Package: <strong style={{ color: category.color }}>{course.avgPackage}</strong>
                                </Typography>
                              </Box>

                              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => navigate('/courses')}
                                  sx={{
                                    borderColor: category.color,
                                    color: category.color,
                                    fontSize: '0.75rem',
                                    py: 0.5,
                                    px: 2,
                                    '&:hover': {
                                      borderColor: category.color,
                                      backgroundColor: `${category.color}10`
                                    }
                                  }}
                                >
                                  View Details
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={openLogin}
                                  sx={{
                                    backgroundColor: category.color,
                                    fontSize: '0.75rem',
                                    py: 0.5,
                                    px: 2,
                                    '&:hover': {
                                      backgroundColor: category.color,
                                      opacity: 0.9
                                    }
                                  }}
                                >
                                  Apply Now
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                      ))}
                    </Box>
                  </Box>
                </Card>
              </Box>
            )
          ))}
        </Box>

        {/* Category Indicators */}
        {!isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, gap: 1 }}>
            {courseCategories.map((_, index) => (
              <Box
                key={index}
                onClick={() => goToCategory(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: index === currentCategory ? '#FF6B35' : 'rgba(255, 107, 53, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#FF6B35',
                    transform: 'scale(1.2)'
                  }
                }}
              />
            ))}
          </Box>
        )}

        {/* CTA */}
        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/courses')}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                fontWeight: 'bold',
                px: 6,
                py: 2,
                borderRadius: '50px',
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 35px rgba(255, 107, 53, 0.4)',
                }
              }}
            >
              Explore All Courses
            </Button>
            {/* <Button
              variant="outlined"
              size="large"
              onClick={openLogin}
              sx={{
                borderColor: '#FF6B35',
                color: '#FF6B35',
                fontWeight: 'bold',
                px: 6,
                py: 2,
                borderRadius: '50px',
                fontSize: '1.1rem',
                textTransform: 'none',
                borderWidth: '2px',
                '&:hover': {
                  borderColor: '#FF6B35',
                  backgroundColor: 'rgba(255, 107, 53, 0.05)',
                }
              }}
            >
              Download Brochure
            </Button> */}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default CourseCatalog;