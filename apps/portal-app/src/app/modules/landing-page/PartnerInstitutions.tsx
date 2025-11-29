import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EngineeringIcon from '@mui/icons-material/Engineering';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';

// Category Images
import engineeringImg from '../../assets/categories/engineering_and_technology.png';
import medicalImg from '../../assets/categories/medical_and_health_sciences.png';
import managementImg from '../../assets/categories/management_and_business.png';
import artsImg from '../../assets/categories/arts_and_humanities.png';
import lawImg from '../../assets/categories/law_and_legal_studies.jpg';
import scienceImg from '../../assets/categories/science_and_research.png';

// Partner College Images
import itmImg from '../../assets/partnered-colleges/itm_uni.jpeg';
import kaveriImg from '../../assets/partnered-colleges/kaveri_telangana.jpg';
import amritaImg from '../../assets/partnered-colleges/amrita_coimbatore.jpg';
import srinidhiImg from '../../assets/partnered-colleges/srinidhi_hyderabad.png';
import upesImg from '../../assets/partnered-colleges/upes_dehradun.jpg';
import bharathImg from '../../assets/partnered-colleges/bharath_chennai.jpg';
import drMgrImg from '../../assets/partnered-colleges/dr_mgr_chennai.jpg';

// import simatsImg from '../../assets/partnered-colleges/simats_chennai.jpg';
// import vitImg from '../../assets/partnered-colleges/vit_chennai.jpg';
// import srmImg from '../../assets/partnered-colleges/srm_chennai.jpg';
// import bvritImg from '../../assets/partnered-colleges/bvrit_narsapur.jpg';
// import grietImg from '../../assets/partnered-colleges/griet_hyderabad.jpeg';
// import kmitImg from '../../assets/partnered-colleges/kmit_hyderabad.png';
// import ritImg from '../../assets/partnered-colleges/rit_bangalore.jpeg';
// import smuImg from '../../assets/partnered-colleges/smu_sikkim.jpg';

const PartnerInstitutions = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const partnerColleges = [
    {
      name: "ITM University",
      type: "University",
      location: "Gwalior, Madhya Pradesh",
      rating: 4.0,
      courses: ["B.Tech", "MBA", "MCA", "M.Tech"],
      icon: <SchoolIcon />,
      established: "1997",
      students: "5000+",
      color: "#FF6B35",
      rank: "Top University",
      image: itmImg
    },
    {
      name: "Kaveri University",
      type: "Engineering",
      location: "Telangana",
      rating: 4.0,
      courses: ["B.Tech", "M.Tech", "CSE", "ECE"],
      icon: <EngineeringIcon />,
      established: "2018",
      students: "1500+",
      color: "#FF8C42",
      rank: "Engineering College",
      image: kaveriImg
    },
    {
      name: "Srinidhi University",
      type: "Multi-disciplinary",
      location: "Hyderabad, Telangana",
      rating: 4.2,
      courses: ["B.Tech", "MBA", "BBA", "M.Tech"],
      icon: <SchoolIcon />,
      established: "2010",
      students: "3000+",
      color: "#F7931E",
      rank: "Top University",
      image: srinidhiImg
    },
    {
      name: "UPES University",
      type: "Multi-disciplinary",
      location: "Dehradun, Uttarakhand",
      rating: 4.4,
      courses: ["B.Tech", "MBA", "BBA", "LLB"],
      icon: <SchoolIcon />,
      established: "2003",
      students: "15000+",
      color: "#FF6B35",
      rank: "Top University",
      image: upesImg
    },
    {
      name: "Bharath University",
      type: "Multi-disciplinary",
      location: "Chennai, Tamil Nadu",
      rating: 4.3,
      courses: ["B.Tech", "MBBS", "MBA", "B.Sc"],
      icon: <SchoolIcon />,
      established: "1984",
      students: "12000+",
      color: "#FF8C42",
      rank: "Top University",
      image: bharathImg
    },
    {
      name: "Dr. MGR University",
      type: "Medical & Engineering",
      location: "Chennai, Tamil Nadu",
      rating: 4.5,
      courses: ["MBBS", "B.Tech", "MBA", "BDS"],
      icon: <LocalHospitalIcon />,
      established: "1987",
      students: "20000+",
      color: "#F7931E",
      rank: "Top Medical University",
      image: drMgrImg
    },
    {
      name: "Amity University",
      type: "Multi-disciplinary",
      location: "Noida, Uttar Pradesh",
      rating: 4.6,
      courses: ["B.Tech", "MBA", "LLB", "B.Sc"],
      icon: <SchoolIcon />,
      established: "2005",
      students: "30000+",
      color: "#FF6B35",
      rank: "Top Private University",
      image: amritaImg
    }
  ];

  const courseCategories = [
    { name: "Engineering & Technology", count: "200+ Colleges", icon: engineeringImg, color: "#FF6B35", description: "B.Tech, M.Tech, PhD programs" },
    { name: "Medical & Health Sciences", count: "150+ Colleges", icon: medicalImg, color: "#FF8C42", description: "MBBS, BDS, Nursing programs" },
    { name: "Management & Business", count: "180+ Colleges", icon: managementImg, color: "#F7931E", description: "MBA, BBA, PGDM programs" },
    { name: "Arts & Humanities", count: "120+ Colleges", icon: artsImg, color: "#FF6B35", description: "BA, MA, Fine Arts programs" },
    { name: "Law & Legal Studies", count: "80+ Colleges", icon: lawImg, color: "#FF9800", description: "LLB, LLM, Legal programs" },
    { name: "Science & Research", count: "100+ Colleges", icon: scienceImg, color: "#FF9800", description: "B.Sc, M.Sc, Research programs" }
  ];

  // Carousel functionality
  const collegesPerSlide = isMobile ? 1 : isTablet ? 2 : 3;
  const totalSlides = Math.ceil(partnerColleges.length / collegesPerSlide);

  // Auto-slide functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentColleges = () => {
    const start = currentSlide * collegesPerSlide;
    const end = start + collegesPerSlide;
    return partnerColleges.slice(start, end);
  };

  return (
    <Box id="partner-institutions" sx={{ py: 4, backgroundColor: 'white', overflow: 'hidden' }}>
      <Container maxWidth="xl">

        {/* Featured Colleges Carousel */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h3"
            component="h3"
            align="center" 
            gutterBottom 
            fontWeight="900" 
            sx={{ 
              mb: 2, 
              mt: 10,
              color: 'black',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem', xl: '3.25rem' },
              letterSpacing: '-0.02em'
            }}
          >
            Partner Colleges and Universities offering <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: '900'
                }}
              >{' '}Scholarships</Box>
          </Typography>
          <Typography 
            variant="h6" 
            color="#666" 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto', 
              mb: 6,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              lineHeight: 1.6,
              fontWeight: 400
            }}
          >
            Discover India's premier educational institutions. Our network of top-tier colleges and universities offers world-class education and scholarships across diverse fields.
          </Typography>

          <Box
            sx={{ position: 'relative' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Navigation Buttons */}
            <>
              <IconButton
                onClick={prevSlide}
                sx={{
                  position: 'absolute',
                  left: { xs: 0, md: -20 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  color: '#FF6B35',
                  zIndex: 2,
                  border: '1px solid rgba(255, 107, 53, 0.2)',
                  width: { xs: 36, md: 40 },
                  height: { xs: 36, md: 40 },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    transform: 'translateY(-50%) scale(1.1)'
                  }
                }}
              >
                <ArrowBackIosIcon sx={{ fontSize: { xs: 16, md: 20 } }} />
              </IconButton>
              <IconButton
                onClick={nextSlide}
                sx={{
                  position: 'absolute',
                  right: { xs: 0, md: -20 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  color: '#FF6B35',
                  zIndex: 2,
                  border: '1px solid rgba(255, 107, 53, 0.2)',
                  width: { xs: 36, md: 40 },
                  height: { xs: 36, md: 40 },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    transform: 'translateY(-50%) scale(1.1)'
                  }
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: { xs: 16, md: 20 } }} />
              </IconButton>
            </>

            {/* College Cards */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 4,
              padding: '0 5rem',
              width: '100%'
            }}>
              {getCurrentColleges().map((college, index) => (
                <Box key={college.name}>
                  <Card
                    sx={{
                      width: '100%',
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
                          {college.courses.slice(0, 4).map((course, courseIndex) => (
                            <Chip
                              key={courseIndex}
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
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>

            {/* Slide Indicators */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
              {Array.from({ length: totalSlides }).map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  sx={{
                    width: { xs: 8, md: 12 },
                    height: { xs: 8, md: 12 },
                    borderRadius: '50%',
                    backgroundColor: index === currentSlide ? '#FF6B35' : 'rgba(255, 107, 53, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#FF6B35',
                      transform: 'scale(1.3)'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/colleges-and-universities')}
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              color: 'white',
              fontWeight: 'bold',
              px: 8,
              py: 2.5,
              borderRadius: '50px',
              fontSize: '1.2rem',
              textTransform: 'none',
              boxShadow: '0 10px 30px rgba(255, 107, 53, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                transform: 'translateY(-3px)',
                boxShadow: '0 15px 40px rgba(255, 107, 53, 0.5)',
              }
            }}
          >
            View All Colleges & Universities
          </Button>
        </Box>
        </Box>
        
        {/* Course Categories */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color="black" 
            sx={{ 
              mb: 4, 
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Explore by Category
          </Typography>
          
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 3,
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {courseCategories.map((category, index) => (
              <Card
                key={index}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 107, 53, 0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  minHeight: '280px',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    border: `2px solid ${category.color}`
                  }
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '120px',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={category.icon}
                    alt={category.name}
                    loading="lazy"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
                <Typography variant="h6" fontWeight="bold" color="black" sx={{ mb: 1, fontSize: '1.1rem' }}>
                  {category.name}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" color={category.color} sx={{ mb: 1 }}>
                  {category.count}
                </Typography>
                <Typography variant="body2" color="#666" sx={{ fontSize: '0.9rem' }}>
                  {category.description}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PartnerInstitutions;