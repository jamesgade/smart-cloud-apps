import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Avatar, 
  useMediaQuery, 
  useTheme, 
  Card, 
  CardContent, 
  Stack
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SchoolIcon from '@mui/icons-material/School';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DownloadIcon from '@mui/icons-material/Download';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleIcon from '@mui/icons-material/People';
import { useAuthModal } from '../../contexts/AuthModalContext';

// Import image
import HeroCollegeImage from '../../assets/images/hero_college.jpg';

const HowItWorks = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { openLogin } = useAuthModal();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Add CSS keyframes for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
      @keyframes glow {
        0%, 100% {
          filter: drop-shadow(0 2px 4px rgba(255, 107, 53, 0.2));
        }
        50% {
          filter: drop-shadow(0 4px 12px rgba(255, 107, 53, 0.4));
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const admissionSteps = [
    {
      number: '1',
      icon: <AssessmentIcon sx={{ fontSize: 24, color: 'white' }} />,
      title: 'Take Our Career Assessment',
      description: 'Comprehensive aptitude and interest assessment to identify your strengths, personality traits, and career inclinations. Get detailed insights into 100+ career paths.',
      duration: '15-20 minutes',
      bgColor: '#FF6B35',
      iconBg: '#FF6B35'
    },
    {
      number: '2',
      icon: <PsychologyIcon sx={{ fontSize: 24, color: 'white' }} />,
      title: 'Get Expert Counseling Session',
      description: 'One-on-one session with certified career counselors who analyze your results and guide you through college selection, course choices, and admission strategies.',
      duration: '30-45 minutes',
      bgColor: '#FF6B35',
      iconBg: '#FF6B35'
    },
    {
      number: '3',
      icon: <SchoolIcon sx={{ fontSize: 24, color: 'white' }} />,
      title: 'Receive Your Admission Roadmap',
      description: 'Get a personalized action plan with college recommendations, application deadlines, scholarship opportunities, and step-by-step guidance for your admission journey.',
      duration: 'Detailed Plan',
      bgColor: '#FF8C42',
      iconBg: '#FF8C42'
    }
  ];

  const features = [
    {
      icon: <BusinessIcon sx={{ fontSize: 32, color: '#FF6B35' }} />,
      title: '500+ Partner Colleges'
    },
    {
      icon: <MenuBookIcon sx={{ fontSize: 32, color: '#FF6B35' }} />,
      title: '100+ Diverse Courses'
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 32, color: '#FF6B35' }} />,
      title: 'Scholarship Guidance'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 32, color: '#FF6B35' }} />,
      title: 'Personalized Mentorship'
    }
  ];

  return (
    <Box id="how-it-works" sx={{ py: 10, backgroundColor: 'white' }}>
      <Container maxWidth="xl">
        {/* Why Choose Campus Yatra Section */}
        <Box sx={{ textAlign: 'center', mb: 12 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: '#FF6B35', 
              fontWeight: 'bold', 
              letterSpacing: 2,
              fontSize: { xs: '0.7rem', md: '0.75rem' },
              textAlign: 'center',
              display: 'block',
              mb: 1
            }}
          >
            Why Choose Campus Yatra
          </Typography>
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            fontWeight="900" 
            color="black" 
            sx={{ 
              mt: 1,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
              textAlign: 'center',
              letterSpacing: '-0.02em'
            }}
          >
            Your Trusted Partner for{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              College Success
            </Box>
          </Typography>
          <Typography 
            variant="h6" 
            color="#666" 
            sx={{ 
              mb: 6, 
              lineHeight: 1.7,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              maxWidth: '800px',
              mx: 'auto',
              fontWeight: 400
            }}
          >
            Join thousands of successful students who have found their perfect college match with our comprehensive guidance and expert support.
          </Typography>
          
          {/* Features Grid */}
          <Box sx={{
            display: 'flex',
            gap: 4,
            alignItems: 'center',
            flexDirection: { xs: 'column', lg: 'row' },
            justifyContent: 'center',
            mb: 8
          }}>
            {/* Image */}
            <Box sx={{
              width: { xs: '100%', lg: '50%' },
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Box sx={{
                width: '100%',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                border: '2px solid rgba(255,107,53,0.3)'
              }}>
                <img
                  src={HeroCollegeImage}
                  alt="Why Choose Campus Yatra"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '415px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </Box>
            </Box>

            {/* Features */}
            <Box sx={{
              width: { xs: '100%', lg: '50%' },
              px: { xs: 2, md: 0 }
            }}>
              <Stack spacing={2}>
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    sx={{
                      p: 3,
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(255, 140, 66, 0.05) 100%)',
                      border: '2px solid transparent',
                      backgroundClip: 'padding-box',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      height: '90px',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '18px',
                        padding: '2px',
                        background: 'linear-gradient(135deg, #FF6B35, #F7931E, #FF6B35)',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        opacity: 0,
                        transition: 'opacity 0.4s ease'
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 0,
                        height: 0,
                        background: 'radial-gradient(circle, rgba(255, 107, 53, 0.3) 0%, transparent 70%)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        transition: 'all 0.6s ease',
                        zIndex: 0
                      },
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(255, 107, 53, 0.25), 0 0 0 1px rgba(255, 107, 53, 0.1)',
                        backgroundColor: 'rgba(255, 107, 53, 0.12)',
                        '&::before': {
                          opacity: 1
                        },
                        '&::after': {
                          width: '300px',
                          height: '300px'
                        },
                        '& .feature-icon': {
                          transform: 'scale(1.2) rotate(5deg)',
                          filter: 'drop-shadow(0 4px 8px rgba(255, 107, 53, 0.4))'
                        },
                        '& .feature-title': {
                          color: '#FF6B35',
                          transform: 'translateX(8px)'
                        }
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <Box 
                        className="feature-icon"
                        sx={{
                          fontSize: '2.5rem',
                          lineHeight: 1,
                          color: '#FF6B35',
                          flexShrink: 0,
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          filter: 'drop-shadow(0 2px 4px rgba(255, 107, 53, 0.2))',
                          animation: 'pulse 2s infinite'
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography 
                        className="feature-title"
                        variant="h6" 
                        fontWeight="bold" 
                        color="black"
                        sx={{
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          background: 'linear-gradient(135deg, #333 0%, #555 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        {feature.title}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* How Campus Yatra Works Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: '#FF6B35', 
              fontWeight: 'bold', 
              letterSpacing: 2,
              fontSize: { xs: '0.7rem', md: '0.75rem' },
              textAlign: 'center',
              display: 'block',
              mb: 1
            }}
          >
            How Campus Yatra Works
          </Typography>
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            fontWeight="900" 
            color="black" 
            sx={{ 
              mt: 1,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
              textAlign: 'center',
              letterSpacing: '-0.02em'
            }}
          >
            Your Simple 3-Step Journey to{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              College Admission
            </Box>
          </Typography>
        </Box>

        {/* Steps Section */}
        <Box sx={{ 
          px: { xs: 2, md: 0 },
          maxWidth: '1000px',
          mx: 'auto'
        }}>
          {admissionSteps.map((step, index) => (
            <Card
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 4,
                    p: 4,
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255, 107, 53, 0.05)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(255, 107, 53, 0.1)',
                    transition: 'all 0.3s ease',
                    minHeight: '180px',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  {/* Step Number and Icon */}
                  <Box sx={{ 
                    position: 'relative', 
                    mr: 4,
                    flexShrink: 0
                  }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: step.iconBg,
                        flexShrink: 0
                      }}
                    >
                      {step.icon}
                    </Avatar>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        width: 32,
                        height: 32,
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `3px solid ${step.iconBg}`,
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: step.iconBg,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      {step.number}
                    </Box>
                  </Box>

                  {/* Text Content */}
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h5" 
                      gutterBottom 
                      fontWeight="bold" 
                      color="black"
                      sx={{
                        fontSize: { xs: '1.3rem', md: '1.5rem' },
                        mb: 2
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTimeIcon sx={{ fontSize: 18, color: '#666', mr: 1 }} />
                      <Typography variant="body2" color="#666" sx={{ fontStyle: 'italic' }}>
                        {step.duration}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      color="#333" 
                      sx={{ 
                        lineHeight: 1.6,
                        fontSize: { xs: '1rem', md: '1.1rem' }
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </Card>
              ))}

          {/* Call to Action */}
          <Box sx={{ 
            mt: 6, 
            textAlign: 'center',
            display: 'flex',
            gap: 3,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={openLogin}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                borderRadius: '30px',
                px: 5,
                py: 2,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
                }
              }}
            >
              Start Your Assessment
            </Button>
            {/* <Button
              variant="outlined"
              size="large"
              onClick={openLogin}
              sx={{
                borderColor: '#FF6B35',
                color: '#FF6B35',
                borderRadius: '30px',
                px: 5,
                py: 2,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1.1rem',
                borderWidth: '2px',
                '&:hover': {
                  borderColor: '#FF6B35',
                  backgroundColor: 'rgba(255, 107, 53, 0.05)',
                }
              }}
            >
              Download Brochure
              <DownloadIcon sx={{ ml: 1 }} />
            </Button> */}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks;