import React, { useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useAuthModal } from '../contexts/AuthModalContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FlightIcon from '@mui/icons-material/Flight';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const StudyAbroadPage = () => {
  const { openLogin } = useAuthModal();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const destinations = [
    {
      country: "USA",
      flag: "🇺🇸",
      universities: "4000+",
      avgFees: "$20,000-50,000/year",
      topCourses: ["Engineering", "Business", "Computer Science", "Medicine"],
      benefits: ["World-class education", "Research opportunities", "Work while studying", "Post-study work visa"],
    },
    {
      country: "UK",
      flag: "🇬🇧",
      universities: "150+",
      avgFees: "£15,000-35,000/year",
      topCourses: ["Engineering", "Law", "Medicine", "MBA"],
      benefits: ["Shorter duration", "Cultural diversity", "2-year post-study work visa", "Research excellence"],
    },
    {
      country: "Canada",
      flag: "🇨🇦",
      universities: "100+",
      avgFees: "CAD 15,000-35,000/year",
      topCourses: ["Computer Science", "Engineering", "Business", "Healthcare"],
      benefits: ["Immigration friendly", "Affordable education", "Safe environment", "3-year work permit"],
    },
    {
      country: "Australia",
      flag: "🇦🇺",
      universities: "43",
      avgFees: "AUD 20,000-45,000/year",
      topCourses: ["Engineering", "IT", "Business", "Health Sciences"],
      benefits: ["Quality education", "Part-time work allowed", "2-4 year work visa", "Beautiful lifestyle"],
    },
    {
      country: "Germany",
      flag: "🇩🇪",
      universities: "400+",
      avgFees: "Free to €3,000/year",
      topCourses: ["Engineering", "Technology", "Business", "Arts"],
      benefits: ["Low/No tuition fees", "Strong economy", "18-month job search visa", "EU opportunities"],
    },
    {
      country: "Singapore",
      flag: "🇸🇬",
      universities: "30+",
      avgFees: "SGD 20,000-40,000/year",
      topCourses: ["Business", "Engineering", "IT", "Finance"],
      benefits: ["Asian education hub", "Safe & modern", "Career opportunities", "Gateway to Asia"],
    },
  ];

  const applicationSteps = [
    "Research & shortlist universities",
    "Prepare required documents",
    "Take standardized tests (IELTS/TOEFL/GRE/GMAT)",
    "Submit applications",
    "Apply for scholarships",
    "Receive admission offers",
    "Apply for student visa",
    "Arrange accommodation",
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 8 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" fontWeight="900" color="black" sx={{ mb: 2 }}>
            Study Abroad 🌍
          </Typography>
          <Typography variant="h6" color="#666" sx={{ maxWidth: '900px', mx: 'auto' }}>
            Explore world-class education opportunities across the globe. We guide you through every step of your international education journey.
          </Typography>
        </Box>

        {/* Why Study Abroad */}
        <Box sx={{ mb: 8, backgroundColor: 'white', p: 5, borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <Typography variant="h4" fontWeight="bold" color="black" sx={{ mb: 4, textAlign: 'center' }}>
            Why Study Abroad?
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: { xs: 'flex-start', lg: 'center' },
            justifyContent: 'center',
            gap: { xs: 3, lg: 0 },
            px: { xs: 2, lg: 4 }
          }}>
            {[
              { icon: <SchoolIcon />, title: "World-Class Education", desc: "Access top-ranked universities and cutting-edge research facilities" },
              { icon: <PublicIcon />, title: "Global Exposure", desc: "Experience diverse cultures and build international networks" },
              { icon: <FlightIcon />, title: "Career Opportunities", desc: "Better job prospects and higher earning potential globally" },
              { icon: <AttachMoneyIcon />, title: "Scholarships Available", desc: "Numerous funding options and financial aid programs" },
            ].map((item, index) => (
              <React.Fragment key={index}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', lg: 'column' },
                  alignItems: 'center',
                  textAlign: { xs: 'left', lg: 'center' },
                  flex: { xs: 'none', lg: 1 },
                  width: { xs: '100%', lg: 'auto' },
                  gap: { xs: 2, lg: 0 },
                  p: 2
                }}>
                  <Box sx={{ 
                    fontSize: { xs: '2.5rem', lg: '3rem' }, 
                    color: '#FF6B35', 
                    mb: { xs: 0, lg: 2 },
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      color="black" 
                      sx={{ 
                        mb: 1,
                        fontSize: { xs: '1rem', lg: '1.25rem' },
                        wordBreak: 'break-word',
                        lineHeight: '1.3'
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="#666"
                      sx={{
                        fontSize: { xs: '0.8rem', lg: '0.875rem' },
                        wordBreak: 'break-word',
                        lineHeight: '1.4'
                      }}
                    >
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
                {index < 3 && (
                  <Box sx={{
                    display: { xs: 'none', lg: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 2
                  }}>
                    <ArrowForwardIcon sx={{ 
                      fontSize: 32, 
                      color: '#FF6B35',
                      opacity: 0.7
                    }} />
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>

        {/* Top Destinations */}
        <Typography variant="h4" fontWeight="bold" color="black" sx={{ mb: 4, textAlign: 'center' }}>
          Popular Study Destinations
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {destinations.map((dest, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 107, 53, 0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                    border: '2px solid #FF6B35',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box sx={{ fontSize: '4rem', mb: 1 }}>{dest.flag}</Box>
                    <Typography variant="h5" fontWeight="bold" color="black">
                      {dest.country}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="#666" sx={{ mb: 1 }}>
                      <strong>Universities:</strong> {dest.universities}
                    </Typography>
                    <Typography variant="body2" color="#666" sx={{ mb: 1 }}>
                      <strong>Avg Fees:</strong> {dest.avgFees}
                    </Typography>
                  </Box>

                  <Typography variant="body2" fontWeight="bold" color="black" sx={{ mb: 1 }}>
                    Top Courses:
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {dest.topCourses.map((course, idx) => (
                      <Typography key={idx} variant="body2" color="#666" sx={{ ml: 2 }}>
                        • {course}
                      </Typography>
                    ))}
                  </Box>

                  <Typography variant="body2" fontWeight="bold" color="black" sx={{ mb: 1 }}>
                    Benefits:
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {dest.benefits.slice(0, 2).map((benefit, idx) => (
                      <Typography key={idx} variant="body2" color="#666" sx={{ ml: 2 }}>
                        ✓ {benefit}
                      </Typography>
                    ))}
                  </Box>

                  <Button
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                    onClick={openLogin}
                    sx={{
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      color: 'white',
                      fontWeight: 'bold',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                      }
                    }}
                  >
                    Explore {dest.country}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Application Process */}
        <Box sx={{ backgroundColor: 'white', p: 5, borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', mb: 6 }}>
          <Typography variant="h4" fontWeight="bold" color="black" sx={{ mb: 4, textAlign: 'center' }}>
            Application Process
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <List>
                {applicationSteps.slice(0, 4).map((step, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: '#FF6B35',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        {index + 1}
                      </Box>
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <List>
                {applicationSteps.slice(4).map((step, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: '#FF6B35',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        {index + 5}
                      </Box>
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Box>

        {/* CTA */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="black" sx={{ mb: 2 }}>
            Ready to Study Abroad?
          </Typography>
          <Typography variant="h6" color="#666" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
            Get personalized guidance from our study abroad experts. Book a free consultation today!
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={openLogin}
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              color: 'white',
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '25px',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)',
              }
            }}
          >
            Book Free Consultation
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default StudyAbroadPage;

