import { useState } from 'react';
import { Box, Typography, IconButton, Collapse, Container, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useAuthModal } from '../../contexts/AuthModalContext';

const ScrollingAlert = () => {
  const [open, setOpen] = useState(true);
  const { openRegister } = useAuthModal();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Collapse in={open}>
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#FF6B35',
          color: 'white',
          py: 1.5,
          position: 'relative',
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              position: 'relative',
              pr: 5
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '100%' }}>
              <CampaignIcon sx={{ fontSize: 24, mr: 1.5, flexShrink: 0 }} />
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  textAlign: 'center'
                }}
              >
                Scholarship Alert 2026-2027: Get access to scholarships through our partnered universities and colleges.
              </Typography>
              <Button
                onClick={openRegister}
                sx={{
                  background: '#fff',
                  ml: '1rem',
                  borderRadius: '2rem',
                  textTransform: 'capitalize',
                  fontWeight: '600',
                  p: '0.1rem 1rem',
                  '&:hover': {
                    background: '#f5f5f5',
                  }
                }}
              >
                Apply Now
              </Button>
            </Box>
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{
                color: 'white',
                flexShrink: 0,
                position: 'absolute',
                right: 0,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
              aria-label="close notification"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Container>
      </Box>
    </Collapse>
  );
};

export default ScrollingAlert;
