import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import {
  Quiz as QuizIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

const ExamsComingSoon: React.FC = () => {
  const handleNotifyMe = () => {
    // TODO: Implement notification signup
    alert('We\'ll notify you when exams feature is available!');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 8
    }}>
      <Container maxWidth="md">
        <Card sx={{ 
          borderRadius: 4, 
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            {/* Icon */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)'
              }}>
                <QuizIcon sx={{ fontSize: 60, color: 'white' }} />
              </Box>
            </Box>

            {/* Coming Soon Badge */}
            <Chip
              label="Coming Soon"
              color="primary"
              sx={{
                mb: 3,
                px: 3,
                py: 1,
                fontSize: '0.9rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                '& .MuiChip-label': {
                  px: 2
                }
              }}
            />

            {/* Main Heading */}
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                color: '#333', 
                mb: 2,
                background: 'linear-gradient(135deg, #333 0%, #666 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Exams Section
            </Typography>

            {/* Subtitle */}
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666', 
                mb: 4, 
                lineHeight: 1.6,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              We're working hard to bring you a comprehensive exam management system. 
              Stay tuned for practice tests, exam schedules, and performance tracking!
            </Typography>

            {/* Features Preview */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 3 }}>
                What's Coming:
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<QuizIcon />}
                  label="Practice Tests"
                  variant="outlined"
                  sx={{ 
                    borderColor: '#FF6B35', 
                    color: '#FF6B35',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.08)'
                    }
                  }}
                />
                <Chip
                  icon={<ScheduleIcon />}
                  label="Exam Schedules"
                  variant="outlined"
                  sx={{ 
                    borderColor: '#FF6B35', 
                    color: '#FF6B35',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.08)'
                    }
                  }}
                />
                <Chip
                  icon={<SchoolIcon />}
                  label="Performance Analytics"
                  variant="outlined"
                  sx={{ 
                    borderColor: '#FF6B35', 
                    color: '#FF6B35',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.08)'
                    }
                  }}
                />
                <Chip
                  icon={<NotificationsIcon />}
                  label="Exam Reminders"
                  variant="outlined"
                  sx={{ 
                    borderColor: '#FF6B35', 
                    color: '#FF6B35',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.08)'
                    }
                  }}
                />
              </Stack>
            </Box>

            {/* Call to Action */}
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
              <Button
                variant="contained"
                size="large"
                onClick={handleNotifyMe}
                startIcon={<NotificationsIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '25px',
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(255, 107, 53, 0.4)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Notify Me When Ready
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#FF6B35',
                  color: '#FF6B35',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '25px',
                  borderWidth: '2px',
                  '&:hover': {
                    borderColor: '#FF6B35',
                    backgroundColor: 'rgba(255, 107, 53, 0.08)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.2)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Learn More
              </Button>
            </Stack>

            {/* Footer Note */}
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#999', 
                mt: 4,
                fontStyle: 'italic'
              }}
            >
              We're committed to providing you with the best exam preparation tools. 
              Thank you for your patience!
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ExamsComingSoon;
