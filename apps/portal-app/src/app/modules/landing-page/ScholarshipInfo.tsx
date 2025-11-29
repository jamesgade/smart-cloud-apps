import React from 'react';
import { Box, Container, Typography, Button, Chip, Grid, Avatar, List, ListItem, ListItemIcon, ListItemText, Card } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { useNavigate } from 'react-router';
import { useAuthModal } from '../../contexts/AuthModalContext';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EngineeringIcon from '@mui/icons-material/Engineering';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import NatureIcon from '@mui/icons-material/Nature';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import scholarshipImg from '../../assets/images/scholarship.jpg';

const ScholarshipInfo = () => {
  const navigate = useNavigate();
  const { openLogin } = useAuthModal();
  type IconComponent = React.ElementType<SvgIconProps>;
  const heroHighlights = [
    'Get Up to ₹3,00,000 Scholarship',
    '100% Free Application',
    'Secure Admission in Top Colleges Across India',
  ];
  const scholarshipHighlights: { title: string; description: string; icon: IconComponent }[] = [
    {
      title: 'Up to ₹3,00,000 Scholarship',
      description: 'High-value financial support based on your scholarship test score.',
      icon: AttachMoneyIcon,
    },
    {
      title: '100% Free Application',
      description: 'Register and attempt the Campus Yatra Scholarship Test without any fee.',
      icon: CheckCircleIcon,
    },
    {
      title: 'Secure Top College Admissions',
      description: 'Use your scholarship to unlock seats in leading partner institutions.',
      icon: SchoolIcon,
    },
  ];
  const applicationSteps: { step: number; title: string; description: string; icon: IconComponent }[] = [
    {
      step: 1,
      title: 'Register for the Scholarship Test',
      description: 'Sign up online with basic details. No application fee required.',
      icon: CheckCircleIcon,
    },
    {
      step: 2,
      title: 'Write the Scholarship Test',
      description: 'Take the online test from home and showcase your knowledge.',
      icon: SchoolIcon,
    },
    {
      step: 3,
      title: 'Get Results & Check Eligibility',
      description: 'Review your score to see the scholarship benefits you qualify for.',
      icon: TrendingUpIcon,
    },
    {
      step: 4,
      title: 'Apply & Claim Scholarship',
      description: 'Choose top colleges with our guidance and redeem your benefits.',
      icon: ArrowForwardIcon,
    },
  ];
  const benefits: { title: string; description: string; icon: IconComponent }[] = [
    {
      title: 'Financial Support',
      description: 'Scholarships that reduce tuition fees, hostel expenses, and other academic costs.',
      icon: AttachMoneyIcon,
    },
    {
      title: 'Free Guidance',
      description: 'Dedicated expert counselors help you shortlist colleges and navigate the process.',
      icon: SupportAgentIcon,
    },
    {
      title: 'Top College Admissions',
      description: 'Secure seats in premium institutions through our partner network across India.',
      icon: SchoolIcon,
    },
    {
      title: 'Personal Mentorship',
      description: 'Learn from experienced mentors who support every stage of your journey.',
      icon: WorkspacePremiumIcon,
    },
    {
      title: 'Career Opportunities',
      description: 'Unlock clarity, build confidence, and follow pathways that lead to long-term success.',
      icon: TrendingUpIcon,
    },
  ];
  const courses: { title: string; description: string; icon: IconComponent; color: string }[] = [
    {
      title: 'Engineering & Technology',
      icon: EngineeringIcon,
      color: '#FF6B35',
      description: 'B.Tech, B.E., Diploma Engineering, and other technical programs.',
    },
    {
      title: 'Medical & Health Sciences',
      icon: LocalHospitalIcon,
      color: '#FF8C42',
      description: 'MBBS, BDS, Nursing, Pharmacy, and allied health courses.',
    },
    {
      title: 'Agriculture & Allied Sciences',
      icon: NatureIcon,
      color: '#F7931E',
      description: 'AgBSc and modern agricultural programs focused on research.',
    },
    {
      title: 'Business & Management',
      icon: BusinessCenterIcon,
      color: '#FFB347',
      description: 'BBA, MBA, and other management-related undergraduate courses.',
    },
    {
      title: 'Other Undergraduate Programs',
      icon: MenuBookIcon,
      color: '#FF6B6B',
      description: 'Wide range of arts, commerce, and science degrees.',
    },
  ];

  return (
    <Box id="scholarship-info" sx={{ py: 8, backgroundColor: 'white' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        {/* Hero */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4, alignItems: 'center', mb: 8 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h2" fontWeight="bold" color="black" sx={{ mb: 2 }}>
              Campus Yatra Scholarship 2026
            </Typography>
            <Typography variant="h6" color="#555" sx={{ mb: 3, lineHeight: 1.6 }}>
              Transform your education with a scholarship program exclusively for students who write the Campus Yatra Scholarship Test.
              Secure admissions, mentorship, and financial aid worth up to ₹3,00,000.
            </Typography>
            <List>
              {heroHighlights.map((highlight) => (
                <ListItem key={highlight} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: '36px' }}>
                    <CheckCircleIcon sx={{ color: '#FF6B35' }} />
                  </ListItemIcon>
                  <ListItemText primary={highlight} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/scholarships')}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  color: 'white',
                  px: 5,
                  py: 2,
                  fontWeight: 'bold',
                  borderRadius: '16px',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Apply Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={openLogin}
                sx={{
                  borderColor: '#FF6B35',
                  color: '#FF6B35',
                  px: 4,
                  py: 2,
                  fontWeight: 'bold',
                  borderRadius: '16px',
                  '&:hover': {
                    borderColor: '#FF6B35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  },
                }}
              >
                Talk to an Expert
              </Button>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <img
              src={scholarshipImg}
              alt="Campus Yatra Scholarship"
              loading="lazy"
              style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)' }}
            />
          </Box>
        </Box>

        {/* About */}
        <Box sx={{ backgroundColor: '#fff3e6', borderRadius: '20px', p: 4, mb: 8, border: '1px solid #FFC9B3' }}>
          <Typography variant="h4" fontWeight="bold" color="black" sx={{ mb: 2 }}>
            About the Scholarship
          </Typography>
          <Typography variant="body1" color="#444" sx={{ lineHeight: 1.8 }}>
            The Campus Yatra Scholarship helps students achieve their dreams by providing financial support,
            guidance, and admission opportunities to top colleges and universities in India — exclusively for students
            who write the scholarship exam. Get personal mentorship, free counseling, and access to partner colleges.
          </Typography>
        </Box>

        {/* Scholarships */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" color="black" sx={{ mb: 2 }}>
            Scholarships
          </Typography>
          <Typography variant="body1" color="#555" sx={{ mb: 4, lineHeight: 1.7 }}>
            Campus Yatra Scholarship 2026 rewards students who attempt the scholarship exam with financial grants,
            expert mentoring, and end-to-end admission support across India.
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {scholarshipHighlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
              <Grid
                size={{ xs: 12, md: 4 }}
                key={highlight.title}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Card
                  sx={{
                    borderRadius: '18px',
                    p: 3,
                    height: '100%',
                    border: '1px solid #FFE0D3',
                    boxShadow: '0 10px 25px rgba(255, 107, 53, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: '#FF6B35',
                      mb: 2,
                      width: 56,
                      height: 56,
                    }}
                  >
                    <Icon sx={{ color: 'white', fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {highlight.title}
                  </Typography>
                  <Typography variant="body2" color="#666">
                    {highlight.description}
                  </Typography>
                </Card>
              </Grid>
            );
            })}
          </Grid>
        </Box>

        {/* Steps */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" color="black" sx={{ mb: 5, textAlign: 'center' }}>
            How to Apply for Campus Yatra Scholarship & Other Scholarships
          </Typography>
          <Grid container spacing={3}>
            {applicationSteps.map((step) => {
              const Icon = step.icon;
              return (
              <Grid size={{ xs: 12, md: 3 }} key={step.step}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: '18px',
                    p: 3,
                    textAlign: 'center',
                    border: '1px solid #FFE0D3',
                    boxShadow: '0 12px 30px rgba(255, 107, 53, 0.1)',
                  }}
                >
                  <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, backgroundColor: '#FF6B35' }}>
                    <Icon sx={{ color: 'white', fontSize: 34 }} />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                    Step {step.step}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="#666">
                    {step.description}
                  </Typography>
                </Card>
              </Grid>
            );
            })}
          </Grid>
        </Box>

        {/* Benefits */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" color="black" sx={{ mb: 4, textAlign: 'center' }}>
            How Students Benefit
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
              <Grid
                size={{ xs: 12, md: 4 }}
                key={benefit.title}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Card
                  sx={{
                    borderRadius: '16px',
                    p: 3,
                    border: '1px solid #FFE0D3',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: '#FF6B35',
                      width: 52,
                      height: 52,
                    }}
                  >
                    <Icon sx={{ color: 'white' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="#555" sx={{ lineHeight: 1.6 }}>
                      {benefit.description}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            );
            })}
          </Grid>
        </Box>

        {/* Partner Colleges */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" color="black" sx={{ mb: 2 }}>
            Partner Colleges and Universities offering Scholarships
          </Typography>
          <Typography variant="body1" color="#555" sx={{ mb: 3, lineHeight: 1.7 }}>
            Leading colleges and universities across India partner with Campus Yatra to reserve scholarship-backed seats,
            provide access to experienced mentors, and support students through the entire admission journey.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/colleges-and-universities')}
              sx={{
                borderColor: '#FF6B35',
                color: '#FF6B35',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#FF6B35',
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                },
              }}
            >
              See All Colleges
            </Button>
          </Box>
        </Box>

        {/* Courses */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" color="black" sx={{ mb: 4, textAlign: 'center' }}>
            Courses Covered Under Campus Yatra Scholarship
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {courses.map((course) => {
              const Icon = course.icon;
              return (
              <Grid
                size={{ xs: 12, md: 4 }}
                key={course.title}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Card
                  sx={{
                    borderRadius: '18px',
                    p: 3,
                    height: '100%',
                    border: `2px solid ${course.color}30`,
                    background: `linear-gradient(135deg, ${course.color}10 0%, ${course.color}05 100%)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Avatar sx={{ backgroundColor: course.color, mb: 2 }}>
                    <Icon sx={{ color: 'white', fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="#555">
                    {course.description}
                  </Typography>
                </Card>
              </Grid>
            );
            })}
          </Grid>
        </Box>

        {/* CTA */}
        <Card
          sx={{
            textAlign: 'center',
            p: 5,
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            Ready to secure your Campus Yatra Scholarship?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Register for the scholarship test, get expert guidance, and unlock admissions across India.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={openLogin}
            sx={{
              backgroundColor: 'white',
              color: '#FF6B35',
              px: 5,
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: '20px',
              '&:hover': {
                backgroundColor: '#FFECE4',
              },
            }}
          >
            Get Scholarship Guidance
          </Button>
        </Card>
      </Container>
    </Box>
  );
};

export default ScholarshipInfo;
