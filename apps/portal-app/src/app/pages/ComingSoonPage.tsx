import React from 'react';
import { Box, Card, CardContent, Typography, Container } from '@mui/material';
import {
  HourglassEmpty as HourglassIcon,
  Construction as ConstructionIcon,
} from '@mui/icons-material';

interface ComingSoonPageProps {
  title?: string;
  message?: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ 
  title = 'Coming Soon',
  message = 'This feature is currently under development. Stay tuned for exciting updates!'
}) => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
          py: 4,
        }}
      >
        <Card
          sx={{
            width: '100%',
            textAlign: 'center',
            boxShadow: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
        >
          <CardContent sx={{ py: 6 }}>
            {/* Icon Animation */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mb: 4,
                '& > *': {
                  animation: 'bounce 2s infinite',
                },
                '@keyframes bounce': {
                  '0%, 100%': {
                    transform: 'translateY(0)',
                  },
                  '50%': {
                    transform: 'translateY(-20px)',
                  },
                },
              }}
            >
              <ConstructionIcon
                sx={{
                  fontSize: 80,
                  color: '#FF6B35',
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                }}
              />
            </Box>

            {/* Title */}
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              {title}
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}
            >
              {message}
            </Typography>

            {/* Hourglass Icon */}
            <HourglassIcon
              sx={{
                fontSize: 48,
                color: '#F7931E',
                animation: 'rotate 3s linear infinite',
                '@keyframes rotate': {
                  '0%': {
                    transform: 'rotate(0deg)',
                  },
                  '50%': {
                    transform: 'rotate(180deg)',
                  },
                  '100%': {
                    transform: 'rotate(360deg)',
                  },
                },
              }}
            />

            {/* Additional Info */}
            <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
              <Typography variant="body2" color="text.secondary">
                We're working hard to bring you this feature. Thank you for your patience!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ComingSoonPage;

