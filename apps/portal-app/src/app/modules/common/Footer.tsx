import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: 'white',
        py: 6,
        mt: 'auto',
        borderTop: '3px solid #FF6B35',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3}}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FF6B35', fontWeight: 'bold' }}>
              About Campus Yatra
            </Typography>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              We are dedicated to helping students find their perfect educational path.
              Our expert consultants guide you through every step of your academic journey.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FF6B35', fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Link href="#" color="rgba(255, 255, 255, 0.7)" display="block" sx={{ mb: 1, '&:hover': { color: '#FF6B35', textDecoration: 'none' } }}>
              About Us
            </Link>
            <Link href="#" color="rgba(255, 255, 255, 0.7)" display="block" sx={{ mb: 1, '&:hover': { color: '#FF6B35', textDecoration: 'none' } }}>
              Our Process
            </Link>
            <Link href="#" color="rgba(255, 255, 255, 0.7)" display="block" sx={{ mb: 1, '&:hover': { color: '#FF6B35', textDecoration: 'none' } }}>
              Success Stories
            </Link>
            <Link href="#" color="rgba(255, 255, 255, 0.7)" display="block" sx={{ mb: 1, '&:hover': { color: '#FF6B35', textDecoration: 'none' } }}>
              FAQ
            </Link>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FF6B35', fontWeight: 'bold' }}>
              Services
            </Typography>
            <Link href="#" color="rgba(255, 255, 255, 0.7)" display="block" sx={{ mb: 1, '&:hover': { color: '#FF6B35', textDecoration: 'none' } }}>
              College Counseling
            </Link>
            <Link href="#" color="rgba(255, 255, 255, 0.7)" display="block" sx={{ mb: 1, '&:hover': { color: '#FF6B35', textDecoration: 'none' } }}>
              Career Guidance
            </Link>
            <Link href="#" color="rgba(255, 255, 255, 0.7)" display="block" sx={{ mb: 1, '&:hover': { color: '#FF6B35', textDecoration: 'none' } }}>
              Test Preparation
            </Link>
            <Link href="#" color="rgba(255, 255, 255, 0.7)" display="block" sx={{ mb: 1, '&:hover': { color: '#FF6B35', textDecoration: 'none' } }}>
              Scholarship Assistance
            </Link>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FF6B35', fontWeight: 'bold' }}>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                info@campusyatra.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                9774333999, 7032777775
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <LocationOnIcon sx={{ mr: 1, fontSize: 20, mt: 0.5 }} />
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ lineHeight: 1.4 }}>
                Smarts Choice Educational Services,<br />
                4th Floor, Above Federal Bank,<br />
                Laxmi Plaza, Vengal Rao Nagar Rd,<br />
                Sanjeeva Reddy Nagar,<br />
                Hyderabad, Telangana 500038
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        <Grid container justifyContent="space-between" alignItems="center">
          <Grid>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              © 2025 Campus Yatra. All rights reserved.
            </Typography>
          </Grid>
          <Grid>
            <Box>
              <IconButton
                component="a"
                href="https://www.facebook.com/campusyatra1/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="facebook"
                sx={{ color: 'white', '&:hover': { color: '#FF6B35' } }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.instagram.com/campusyatra1/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="instagram"
                sx={{ color: 'white', '&:hover': { color: '#FF6B35' } }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.youtube.com/@CampusYatra1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="youtube"
                sx={{ color: 'white', '&:hover': { color: '#FF6B35' } }}
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.linkedin.com/company/campus-yatra/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="linkedin"
                sx={{ color: 'white', '&:hover': { color: '#FF6B35' } }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://x.com/campusyatra1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="twitter"
                sx={{ color: 'white', '&:hover': { color: '#FF6B35' } }}
              >
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)" align="center">
            Disclaimer: All information provided is for educational purposes only.
            Results may vary based on individual circumstances. We recommend thorough
            research before making any educational decisions.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;