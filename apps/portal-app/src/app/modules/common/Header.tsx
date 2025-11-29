import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
  Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CampaignIcon from '@mui/icons-material/Campaign';
// No dropdown icon needed
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import QuizIcon from '@mui/icons-material/Quiz';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate, useLocation } from 'react-router';
import CampusYatraEducationLogo from '../../components/logos/campusyatra/campusYatralogodark';
import { useAuthModal } from '../../contexts/AuthModalContext';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [bannerOpen, setBannerOpen] = useState(true);
  // Dropdowns removed for desktop view
  const navigate = useNavigate();
  const location = useLocation();
  const { openLogin, openRegister } = useAuthModal();

  const handleCloseBanner = () => {
    setBannerOpen(false);
  };

  // Menu handlers
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Dropdown handlers removed (no desktop dropdowns)

  const handleNavigation = (path: string) => {
    // Close mobile nav first
    setAnchorElNav(null);
    navigate(path);
  };

  // Helper function to check if a page is active
  const isActivePage = (page: string) => {
    const currentPath = location.pathname;
    if (page.toLowerCase() === 'home') {
      return currentPath === '/';
    }
    const expectedPath = `/${page.toLowerCase().replace(/\s+/g, '-')}`;
    return currentPath === expectedPath;
  };

  // Navigation items
  const mainNavItems = [
    { name: 'Home', icon: <SchoolIcon />, path: '/' },
    { name: 'Colleges', icon: <AccountBalanceIcon />, path: '/colleges-and-universities' },
    { name: 'Courses', icon: <SchoolIcon />, path: '/courses' },
    { name: 'Services', icon: <ArticleIcon />, path: '/services' },
    { name: 'Blogs', icon: <ArticleIcon />, path: '/blogs' },
    { name: 'Exams', icon: <QuizIcon />, path: '/exams' },
    { name: 'Scholarships', icon: <AccountBalanceIcon />, path: '/scholarships' },
    { name: 'Education Loans', icon: <AccountBalanceWalletIcon />, path: '/education-loans' },
    { name: 'Study Abroad', icon: <TravelExploreIcon />, path: '/study-abroad' }
  ];

  // Dropdown data
  const collegeCategories = [
    'IITs & NITs',
    'Medical Colleges',
    'Law Schools',
    'Management Institutes',
    'Arts & Science Colleges',
    'Engineering Colleges',
    'Design Schools',
    'Private Universities'
  ];

  const examCategories = [
    'JEE Main & Advanced',
    'NEET',
    'CLAT',
    'CAT',
    'GATE',
    'UPSC',
    'SSC',
    'Banking Exams'
  ];

  const scholarshipCategories = [
    'Merit Scholarships',
    'Need-Based Aid',
    'Government Scholarships',
    'Private Scholarships',
    'International Scholarships',
    'Research Grants',
    'Sports Scholarships',
    'Arts & Culture'
  ];

  const courseCategories = [
    'Engineering & Technology',
    'Medical & Health Sciences',
    'Management & Business',
    'Law & Legal Studies',
    'Arts & Humanities',
    'Science & Research',
    'Design & Fashion',
    'Agriculture & Forestry'
  ];

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: 'white',
          top: 0,
          zIndex: 1100,
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
          borderBottom: '1px solid rgba(255, 107, 53, 0.1)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: '60px', md: '70px' }, py: 1 }}>
          {/* Desktop Logo */}
          <Box
            sx={{
              mr: 3,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              minWidth: '180px',
              maxWidth: '220px',
              flex: '0 0 auto'
            }}
          >
            <CampusYatraEducationLogo />
          </Box>

          {/* Mobile Logo */}
          <Box
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              flex: '1 1 auto',
              justifyContent: 'flex-start'
            }}
          >
            <CampusYatraEducationLogo />
          </Box>

          {/* Mobile Login Button & Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flex: '0 0 auto', alignItems: 'center', gap: 1 }}>
            <Button
              onClick={openLogin}
              variant="contained"
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '20px',
                px: 2,
                py: 0.5,
                textTransform: 'none',
                fontSize: '0.8rem',
                minWidth: '60px',
                boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
                }
              }}
            >
              Login
            </Button>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{
                color: '#FF6B35',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  color: '#FF8C42',
                }
              }}
            >
              <MenuIcon sx={{ fontSize: '1.8rem' }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  backgroundColor: 'white',
                  color: '#333',
                  minWidth: '300px',
                  mt: 1,
                  border: '1px solid #FF6B35',
                  boxShadow: '0 4px 15px rgba(255, 107, 53, 0.2)',
                  borderRadius: '12px',
                }
              }}
            >
              {mainNavItems.map((item, index) => (
                <MenuItem 
                  key={item.name} 
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    py: 1.5,
                    color: '#333',
                    backgroundColor: isActivePage(item.name) ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                    borderLeft: isActivePage(item.name) ? '4px solid #FF6B35' : '4px solid transparent',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE8E0 100%)',
                      color: '#FF6B35',
                      fontWeight: 'bold',
                    }
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ color: isActivePage(item.name) ? '#FF6B35' : '#FF6B35' }}>{item.icon}</Box>
                    <Typography 
                      textAlign="center" 
                      sx={{
                        background: isActivePage(item.name) 
                          ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                          : 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontWeight: isActivePage(item.name) ? 'bold' : 'bold',
                        fontSize: '1rem',
                        color: isActivePage(item.name) ? '#FF6B35' : 'inherit'
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
              
              {/* Mobile Login Button */}
              <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 107, 53, 0.2)', mt: 2 }}>
                <Button
                  onClick={() => {
                    handleCloseNavMenu();
                    openLogin();
                  }}
                  variant="contained"
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '20px',
                    py: 1.5,
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
                    }
                  }}
                >
                  Login
                </Button>
              </Box>
            </Menu>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              {mainNavItems.map((item) => (
                <Button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    my: 2,
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    mx: 0.5,
                    position: 'relative',
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: isActivePage(item.name) ? '100%' : '0%',
                      height: '2px',
                      bottom: '8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      transition: 'width 0.3s ease',
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                      '&::after': {
                        width: '80%',
                      }
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Stack>
          </Box>

          {/* CTA Buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Button
              onClick={openLogin}
              variant="contained"
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '20px',
                px: 3,
                py: 1,
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
                }
              }}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>

    {/* Sticky Banner Below AppBar */}
    <Box
      sx={{
        width: '100%',
        position: 'sticky',
        top: { xs: '60px', md: '70px' },
        zIndex: 1099,
      }}
    >
      <Collapse in={bannerOpen}>
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#FF6B35',
            color: 'white',
            py: 1.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 1.5, md: 2 },
              position: 'relative'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: { xs: 1, md: 2 },
              maxWidth: '100%' 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CampaignIcon sx={{ fontSize: { xs: 20, md: 24 }, flexShrink: 0 }} />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' },
                    textAlign: 'center'
                  }}
                >
                  Scholarship Alert 2026-2027: Get access to scholarships through our partnered universities and colleges.
                </Typography>
              </Box>
              <Button
                onClick={openRegister}
                sx={{
                  background: '#fff',
                  borderRadius: '2rem',
                  textTransform: 'capitalize',
                  fontWeight: '600',
                  p: { xs: '0.25rem 0.75rem', md: '0.5rem 1rem' },
                  fontSize: { xs: '0.75rem', md: '1rem' },
                  '&:hover': {
                    background: '#f5f5f5',
                  }
                }}
              >
                Apply Now
              </Button>
            </Box>
            {/* <IconButton
              size="small"
              onClick={handleCloseBanner}
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
            </IconButton> */}
          </Box>
        </Container>
        </Box>
      </Collapse>
    </Box>
    </>
  );
};

export default Header;