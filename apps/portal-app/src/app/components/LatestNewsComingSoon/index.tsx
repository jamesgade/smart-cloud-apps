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
  Article as ArticleIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';

const LatestNewsComingSoon: React.FC = () => {
  const handleNotifyMe = () => {
    // TODO: Implement notification signup
    alert('We\'ll notify you when latest news feature is available!');
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
                <ArticleIcon sx={{ fontSize: 60, color: 'white' }} />
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
              Latest News
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
              Stay updated with the latest education news, college updates, exam notifications, 
              and important announcements. We're building a comprehensive news center for you!
            </Typography>

            {/* Features Preview */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 3 }}>
                What's Coming:
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<ArticleIcon />}
                  label="Education News"
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
                  label="Exam Updates"
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
                  icon={<TrendingIcon />}
                  label="Trending Topics"
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
                  label="Push Notifications"
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
              We're working hard to bring you the most relevant and up-to-date education news. 
              Thank you for your patience!
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LatestNewsComingSoon;
