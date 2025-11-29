import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuthModal } from '../../contexts/AuthModalContext';

import AssessmentImage1 from '../../assets/images/assesment_image1.png';
import AssessmentImage2 from '../../assets/images/assesment_image2.png';
import AssessmentImage3 from '../../assets/images/assesment_image3.png';

import LandingVideo from '../../assets/videos/landing-video.mp4';

const HeroSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { openLogin, openRegister } = useAuthModal();


  const notifications = [
    {
      title: 'JEE Main 2026 Applications Open',
      date: 'Feb 1-15, 2026'
    },
    {
      title: 'JEE Advanced 2026 Registration',
      date: 'May 26, 2026'
    },
    {
      title: 'BITSAT 2026 Application Process',
      date: 'Jun 15-30, 2026'
    },
    {
      title: 'VITEEE 2026 Admissions Open',
      date: 'Apr 20-30, 2026'
    },
    {
      title: 'NEET 2026 Registration Starts',
      date: 'Mar 1-31, 2026'
    },
    {
      title: 'CLAT 2026 Application Deadline',
      date: 'Apr 15, 2026'
    },
    {
      title: 'SRMJEE 2026 Phase 1 Registration',
      date: 'Jan 20 - Feb 25, 2026'
    },
    {
      title: 'MIT Entrance Exam 2026',
      date: 'Apr 10-20, 2026'
    },
    {
      title: 'COMEDK 2026 Applications Open',
      date: 'Feb 10 - Mar 20, 2026'
    },
    {
      title: 'WBJEE 2026 Registration',
      date: 'Mar 15 - Apr 15, 2026'
    },
    {
      title: 'KCET 2026 Application Process',
      date: 'Jan 25 - Feb 10, 2026'
    },
    {
      title: 'MH-CET 2026 Registration',
      date: 'Feb 1 - Mar 15, 2026'
    }
  ];

  const stats = [
    {
      icon: <SchoolIcon sx={{ fontSize: 32 }} />,
      value: '100+',
      label: 'Undergraduate Programs',
      sublabel: 'Medical, Engineering, Law & more',
      color: '#FF6B35'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 32 }} />,
      value: '10,000+',
      label: 'Students Guided',
      sublabel: 'Success stories',
      color: '#FF8C42'
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 32 }} />,
      value: '18+',
      label: 'Years Experience',
      sublabel: 'Since 2007',
      color: '#F7931E'
    }
  ];

  return (
    <Box
      id="hero-section"
      component="main"
      sx={{
        backgroundColor: 'white',
        color: 'black',
        position: 'relative',
        textAlign: 'center',
        overflow: 'hidden',
        py: { xs: 6, md: 10 }
      }}
    >
      {/* Background Video */}
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
      >
        <source src={LandingVideo} type="video/mp4" />
      </Box>

      {/* Video Overlay for text readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(135deg,
              rgba(255, 255, 255, 0.85) 0%,
              rgba(255, 255, 255, 0.75) 50%,
              rgba(255, 255, 255, 0.85) 100%
            )
          `,
          zIndex: 1
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Main Title - Centered */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              component="h3"
              gutterBottom
              fontWeight="900"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem', xl: '3.25rem' },
                lineHeight: 1.1,
                color: 'black',
                mb: 3,
                letterSpacing: '-0.02em'
              }}
            >
              Get Admission to Your
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: '900'
                }}
              >
                {' '}Dream College{' '}
              </Box>
               with Expert Guidance
            </Typography>
          </Box>

          {/* Two Column Layout: Left Content + Right Notifications */}
          <Grid container alignItems='center' spacing={4} sx={{ mb: 5, padding: { sm: '0 5rem' }  }}>
            {/* Left Column: Tagline + Images */}
            <Grid size={{ xs: 12, md: 7 }}>
              {/* Tagline - Left Aligned */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#666',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    fontWeight: 500,
                    mb: 1,
                    textAlign: 'center'
                  }}
                >
                  Smarts Choice Educational Services presents
                  <Box
                  component="span"
                  sx={{
                    fontWeight: 'bold',
                    color: '#FF6B35',
                    mb: 2,
                    textAlign: 'center'
                  }}
                >
                  {' '}Campus Yatra
                </Box>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#555',
                    lineHeight: 1.7,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    fontWeight: 400,
                    textAlign: 'center'
                  }}
                >
                  Campus Yatra guides you to the right course, college, and scholarship with expert counseling and complete admission support for 2026.
                </Typography>
              </Box>

              {/* Images Below Text */}
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  mt: 3,
                  justifyContent: { xs: 'center', md: 'center' }
                }}
              >
                <Box sx={{ width: { xs: 90, md: 110 }, height: { xs: 90, md: 110 }, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '2px solid rgba(255,107,53,0.3)' }}>
                  <img src={AssessmentImage1} alt="assessment" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </Box>
                <Box sx={{ width: { xs: 90, md: 110 }, height: { xs: 90, md: 110 }, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '2px solid rgba(255,107,53,0.3)' }}>
                  <img src={AssessmentImage2} alt="selection" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </Box>
                <Box sx={{ width: { xs: 90, md: 110 }, height: { xs: 90, md: 110 }, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '2px solid rgba(255,107,53,0.3)' }}>
                  <img src={AssessmentImage3} alt="success" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </Box>
              </Stack>
            </Grid>

            {/* Right Column: Notifications Card */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 0,
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 107, 53, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: { xs: '400px', md: '550px' },
                  overflow: 'hidden'
                }}
              >
                {/* Header with colored background */}
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    p: 2.5,
                    borderBottom: '3px solid #FF6B35',
                    flexShrink: 0
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="white"
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '1rem'
                    }}
                  >
                    Latest Updates
                  </Typography>
                </Box>

                {/* Notification Items with Auto-Scroll */}
                <Box
                  sx={{
                    position: 'relative',
                    flex: '1 1 auto',
                    overflow: 'hidden',
                    minHeight: 0,
                    '&:hover > *': {
                      animationPlayState: 'paused'
                    }
                  }}
                >
                  {/* Scrolling Container */}
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      animation: 'scrollUp 30s linear infinite',
                      '@keyframes scrollUp': {
                        '0%': {
                          transform: 'translateY(0)',
                        },
                        '100%': {
                          transform: 'translateY(-50%)',
                        },
                      },
                    }}
                  >
                    {/* Duplicate notifications for seamless loop */}
                    {[...notifications, ...notifications].map((notification, index) => (
                      <Box
                        key={index}
                        sx={{
                          py: 1.5,
                          px: 5,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                          transition: 'all 0.2s ease',
                          minHeight: { xs: '70px', md: '85px' },
                          '&:hover': {
                            backgroundColor: 'rgba(255, 107, 53, 0.02)',
                          }
                        }}
                      >
                        <Box sx={{ flex: 1, textAlign: 'start' }}>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="black"
                            sx={{
                              mb: 0.3,
                              fontSize: '0.95rem'
                            }}
                          >
                            {notification.title}
                          </Typography>
                          <Typography variant="caption" color="#666">
                            {notification.date}
                          </Typography>
                        </Box>
                        <Button
                          variant="text"
                          size="small"
                          onClick={openRegister}
                          sx={{
                            color: '#FF6B35',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            textTransform: 'none',
                            minWidth: 'auto',
                            px: 1,
                            '&:hover': {
                              backgroundColor: 'rgba(255, 107, 53, 0.08)',
                            }
                          }}
                        >
                          View
                        </Button>
                      </Box>
                    ))}
                  </Box>
                  
                  {/* Fade overlay at top and bottom */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '30px',
                      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95), transparent)',
                      pointerEvents: 'none',
                      zIndex: 1
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '30px',
                      background: 'linear-gradient(to top, rgba(255, 255, 255, 0.95), transparent)',
                      pointerEvents: 'none',
                      zIndex: 1
                    }}
                  />
                </Box>

                {/* View All Button */}
                <Box sx={{ p: 2, pt: 0, flexShrink: 0 }}>
                  <Button
                    variant="text"
                    fullWidth
                    onClick={openRegister}
                    sx={{
                      width:'140px',
                      color: '#fff',
                      fontWeight: 'bold',
                      borderRadius: '2rem',
                      py: 1,
                      fontSize: '0.95rem',
                      textTransform: 'none',
                      letterSpacing: '1px',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
                      }
                    }}
                  >
                    View All
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* CTA Buttons - Below Content */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{
              mb: 6,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              onClick={openLogin}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                fontWeight: 'bold',
                px: 5,
                py: 2,
                borderRadius: '50px',
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 8px 30px rgba(255, 107, 53, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 40px rgba(255, 107, 53, 0.5)',
                },
                minWidth: { xs: '100%', sm: 'auto' }
              }}
            >
              Start Free Assessment
            </Button>
            {/* <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/college')}
              sx={{
                borderColor: '#FF6B35',
                color: '#FF6B35',
                fontWeight: 'bold',
                px: 5,
                py: 2,
                borderRadius: '50px',
                fontSize: '1.1rem',
                textTransform: 'none',
                borderWidth: '2px',
                '&:hover': {
                  borderColor: '#FF6B35',
                  backgroundColor: 'rgba(255, 107, 53, 0.08)',
                  borderWidth: '2px',
                },
                minWidth: { xs: '100%', sm: 'auto' }
              }}
            >
              Explore Colleges
            </Button> */}
          </Stack>

          {/* Stats Grid */}
          <Grid container spacing={3} sx={{ justifyContent: 'center', maxWidth: { xs: '100%', sm: '1200px' }, mx: 'auto' }}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 12, sm: 4 }} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 107, 53, 0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    height: '180px',
                    width: { xs: '100%', sm: '280px' },
                    maxWidth: '280px',
                    minWidth: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.05)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: `1px solid ${stat.color}40`
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: `${stat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      border: `2px solid ${stat.color}30`
                    }}
                  >
                    <Box sx={{ color: stat.color }}>
                      {stat.icon}
                    </Box>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="black" sx={{ mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="600" color="black" sx={{ mb: 0.5 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="caption" color="#666">
                    {stat.sublabel}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
    </Box>
  );
};

export default HeroSection;