import React, { useEffect } from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Chip, Grid, Avatar, List, ListItem, ListItemIcon, ListItemText, Accordion, AccordionSummary, AccordionDetails, Stack } from '@mui/material';
import { useAuthModal } from '../contexts/AuthModalContext';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const EducationLoansPage = () => {
  const { openLogin } = useAuthModal();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const loanProviders = [
    {
      name: "State Bank of India (SBI)",
      type: "Public Sector",
      interestRate: "8.15% - 11.85%",
      maxAmount: "₹1.5 Crore",
      processingFee: "₹500 - ₹15,000",
      features: ["No collateral for loans up to ₹7.5 Lakh", "Moratorium period available", "Flexible repayment options"],
      icon: <BusinessIcon />,
      color: "#FF6B35"
    },
    {
      name: "HDFC Bank",
      type: "Private Sector",
      interestRate: "8.50% - 13.25%",
      maxAmount: "₹50 Lakh",
      processingFee: "Up to 1% of loan amount",
      features: ["Quick approval process", "Online application", "Competitive interest rates"],
      icon: <AccountBalanceWalletIcon />,
      color: "#FF8C42"
    },
    {
      name: "ICICI Bank",
      type: "Private Sector",
      interestRate: "8.75% - 13.50%",
      maxAmount: "₹50 Lakh",
      processingFee: "Up to 1% of loan amount",
      features: ["No collateral required", "Easy documentation", "Flexible tenure"],
      icon: <SecurityIcon />,
      color: "#F7931E"
    },
    {
      name: "Axis Bank",
      type: "Private Sector",
      interestRate: "8.25% - 13.00%",
      maxAmount: "₹75 Lakh",
      processingFee: "Up to 1% of loan amount",
      features: ["International education support", "Part-time job assistance", "Career guidance"],
      icon: <PublicIcon />,
      color: "#FF6B35"
    },
    {
      name: "Canara Bank",
      type: "Public Sector",
      interestRate: "8.40% - 12.15%",
      maxAmount: "₹1 Crore",
      processingFee: "₹500 - ₹10,000",
      features: ["Government-backed schemes", "Low processing fees", "Extended repayment period"],
      icon: <BusinessIcon />,
      color: "#FF8C42"
    },
    {
      name: "Bank of Baroda",
      type: "Public Sector",
      interestRate: "8.30% - 11.90%",
      maxAmount: "₹80 Lakh",
      processingFee: "₹500 - ₹15,000",
      features: ["Special schemes for girls", "No prepayment penalty", "Insurance coverage available"],
      icon: <AccountBalanceWalletIcon />,
      color: "#F7931E"
    }
  ];

  const loanTypes = [
    {
      title: "Domestic Education Loans",
      description: "For studies within India",
      features: [
        "Coverage for tuition fees, books, and living expenses",
        "Interest rates starting from 8.15%",
        "Repayment starts after course completion",
        "No collateral required for loans up to ₹7.5 Lakh"
      ],
      icon: <SchoolIcon />,
      color: "#FF6B35"
    },
    {
      title: "International Education Loans",
      description: "For studies abroad",
      features: [
        "Higher loan amounts up to ₹1.5 Crore",
        "Covers tuition, living expenses, and travel",
        "Moratorium period during studies",
        "Competitive forex rates"
      ],
      icon: <PublicIcon />,
      color: "#FF8C42"
    },
    {
      title: "Professional Course Loans",
      description: "For specialized courses",
      features: [
        "MBA, Engineering, Medical, Law courses",
        "Higher loan limits for premium institutes",
        "Special interest rates for top colleges",
        "Career placement assistance"
      ],
      icon: <TrendingUpIcon />,
      color: "#F7931E"
    }
  ];

  const applicationSteps = [
    {
      step: 1,
      title: "Check Eligibility",
      description: "Verify age, course, and institute eligibility criteria",
      icon: <CheckCircleIcon />
    },
    {
      step: 2,
      title: "Choose Bank",
      description: "Compare interest rates and select suitable lender",
      icon: <BusinessIcon />
    },
    {
      step: 3,
      title: "Gather Documents",
      description: "Collect academic records, admission letter, and financial documents",
      icon: <SchoolIcon />
    },
    {
      step: 4,
      title: "Submit Application",
      description: "Complete application form and submit with required documents",
      icon: <ArrowForwardIcon />
    },
    {
      step: 5,
      title: "Loan Sanction",
      description: "Bank verifies and sanctions the loan amount",
      icon: <SecurityIcon />
    }
  ];

  const faqItems = [
    {
      question: "What is the maximum loan amount I can get?",
      answer: "The maximum loan amount varies by bank and course. Public sector banks offer up to ₹1.5 Crore for international studies and ₹50 Lakh for domestic courses. Private banks typically offer up to ₹75 Lakh."
    },
    {
      question: "Do I need collateral for education loans?",
      answer: "For loans up to ₹7.5 Lakh, no collateral is required. For higher amounts, banks may require collateral or a third-party guarantee. Government schemes often have relaxed collateral requirements."
    },
    {
      question: "What is the moratorium period?",
      answer: "Moratorium period is the time during which you don't need to pay EMI (usually during course duration + 6 months after completion). Interest continues to accrue during this period."
    },
    {
      question: "Can I get a loan for part-time or distance learning courses?",
      answer: "Most banks prefer full-time regular courses. However, some banks offer loans for part-time courses from recognized institutions. Distance learning courses have limited loan options."
    },
    {
      question: "What documents are required for education loan?",
      answer: "Common documents include: Admission letter, academic records, income proof of co-applicant, bank statements, identity proof, address proof, and course fee structure."
    },
    {
      question: "How long does it take to get loan approval?",
      answer: "Loan approval typically takes 7-15 working days for domestic courses and 15-30 days for international courses, depending on document verification and bank processes."
    }
  ];

  const governmentSchemes = [
    {
      name: "Central Sector Interest Subsidy Scheme",
      description: "Interest subsidy for economically weaker sections",
      benefit: "100% interest subsidy during moratorium period",
      eligibility: "Family income less than ₹4.5 Lakh per annum",
      icon: <PublicIcon />
    },
    {
      name: "Padho Pardesh Scheme",
      description: "Interest subsidy for minority students studying abroad",
      benefit: "Interest subsidy up to 3% during course duration",
      eligibility: "Minority community students with admission in top universities",
      icon: <SchoolIcon />
    },
    {
      name: "Dr. Ambedkar Central Sector Scheme",
      description: "Interest subsidy for SC/ST students",
      benefit: "Interest subsidy during entire moratorium period",
      eligibility: "SC/ST students pursuing higher education",
      icon: <TrendingUpIcon />
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#fafafa',
      overflow: 'hidden'
    }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        py: { xs: 6, md: 8 },
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              fontWeight="bold" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
                lineHeight: 1.2
              }}
            >
              Education Loans in India
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto', 
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                opacity: 0.95
              }}
            >
              Finance your dreams with the best education loan options from top Indian banks. 
              Get competitive interest rates and flexible repayment options.
            </Typography>
          </Box>

          {/* Quick Stats */}
          <Box sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            p: { xs: 3, md: 4 },
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            maxWidth: '900px',
            mx: 'auto'
          }}>
            <Grid container spacing={3} sx={{ textAlign: 'center', justifyContent: 'center' }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography 
                    variant="h3" 
                    fontWeight="bold"
                    sx={{ 
                      fontSize: { xs: '1.8rem', md: '2.5rem' },
                      mb: 0.5,
                      lineHeight: 1.2
                    }}
                  >
                    50+
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      opacity: 0.9,
                      textAlign: 'center'
                    }}
                  >
                    Partner Banks
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: '1.8rem', md: '2.5rem' },
                      mb: 0.5,
                      lineHeight: 1.2
                    }}
                  >
                    ₹1.5 Cr
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      opacity: 0.9,
                      textAlign: 'center'
                    }}
                  >
                    Max Loan Amount
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: '1.8rem', md: '2.5rem' },
                      mb: 0.5,
                      lineHeight: 1.2
                    }}
                  >
                    8.15%
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      opacity: 0.9,
                      textAlign: 'center'
                    }}
                  >
                    Starting Interest Rate
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: '1.8rem', md: '2.5rem' },
                      mb: 0.5,
                      lineHeight: 1.2
                    }}
                  >
                    15 Days
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      opacity: 0.9,
                      textAlign: 'center'
                    }}
                  >
                    Average Approval Time
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
        {/* Loan Types */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              color="black" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                lineHeight: 1.2
              }}
            >
              Types of Education Loans
            </Typography>
            <Typography 
              variant="h6" 
              color="#666" 
              sx={{ 
                mb: 5, 
                textAlign: 'center', 
                maxWidth: '700px', 
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.25rem' },
                lineHeight: 1.6
              }}
            >
              Choose the right type of education loan based on your study destination and course requirements.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
            {loanTypes.map((type, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                <Card sx={{
                  height: '100%',
                  borderRadius: '24px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  border: `1px solid ${type.color}20`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: `0 20px 60px ${type.color}25`,
                    border: `2px solid ${type.color}40`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${type.color} 0%, ${type.color}80 100%)`,
                  }
                }}>
                  <CardContent sx={{ p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                      <Avatar sx={{
                        width: { xs: 50, md: 60 },
                        height: { xs: 50, md: 60 },
                        backgroundColor: type.color,
                        boxShadow: `0 8px 24px ${type.color}30`
                      }}>
                        {type.icon}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h5" 
                          fontWeight="bold" 
                          color="black" 
                          sx={{ 
                            mb: 0.5,
                            fontSize: { xs: '1.25rem', md: '1.5rem' }
                          }}
                        >
                          {type.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          color="#666"
                          sx={{ 
                            fontSize: { xs: '0.875rem', md: '1rem' }
                          }}
                        >
                          {type.description}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <List dense sx={{ flex: 1 }}>
                      {type.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} sx={{ px: 0, py: 0.75 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon sx={{ color: type.color, fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature} 
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              sx: { 
                                fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                lineHeight: 1.5
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Top Loan Providers */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              color="black" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                lineHeight: 1.2
              }}
            >
              Top Education Loan Providers
            </Typography>
            <Typography 
              variant="h6" 
              color="#666" 
              sx={{ 
                mb: 5, 
                textAlign: 'center', 
                maxWidth: '700px', 
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.25rem' },
                lineHeight: 1.6
              }}
            >
              Compare rates and features from India's leading banks and financial institutions.
            </Typography>
          </Box>

          <Box sx={{ 
            maxWidth: '1000px', 
            mx: 'auto',
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}>
            {loanProviders.map((provider, index) => (
              <Box
                key={index}
                sx={{
                  borderBottom: index < loanProviders.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 53, 0.02)',
                  }
                }}
              >
                <Box sx={{ p: { xs: 3, md: 4 } }}>
                  {/* Mobile Layout */}
                  <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
                    <Stack spacing={3}>
                      {/* Bank Info */}
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{
                          width: 45,
                          height: 45,
                          backgroundColor: provider.color,
                          boxShadow: `0 6px 20px ${provider.color}30`
                        }}>
                          {provider.icon}
                        </Avatar>
                        <Box>
                          <Typography 
                            variant="h6" 
                            fontWeight="bold" 
                            color="black"
                            sx={{ 
                              fontSize: '1.1rem',
                              mb: 0.5
                            }}
                          >
                            {provider.name}
                          </Typography>
                          <Chip 
                            label={provider.type} 
                            size="small" 
                            sx={{ 
                              backgroundColor: `${provider.color}15`,
                              color: provider.color,
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              height: 24
                            }} 
                          />
                        </Box>
                      </Stack>

                      {/* Key Details */}
                      <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography variant="body2" color="#666" fontWeight="500" sx={{ mb: 0.5 }}>
                            Interest Rate
                          </Typography>
                          <Typography variant="body1" fontWeight="bold" color={provider.color}>
                            {provider.interestRate}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography variant="body2" color="#666" fontWeight="500" sx={{ mb: 0.5 }}>
                            Max Amount
                          </Typography>
                          <Typography variant="body1" fontWeight="bold" color="black">
                            {provider.maxAmount}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography variant="body2" color="#666" fontWeight="500" sx={{ mb: 0.5 }}>
                            Processing Fee
                          </Typography>
                          <Typography variant="body1" fontWeight="bold" color="black">
                            {provider.processingFee}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Features */}
                      <Stack spacing={1}>
                        {provider.features.slice(0, 2).map((feature, featureIndex) => (
                          <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon sx={{ color: provider.color, fontSize: 16 }} />
                            <Typography 
                              variant="body2" 
                              color="#666"
                              sx={{ 
                                fontSize: '0.875rem',
                                lineHeight: 1.4
                              }}
                            >
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                  </Box>

                  {/* Desktop Layout */}
                  <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 4 }}>
                    {/* Bank Info */}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: '250px' }}>
                      <Avatar sx={{
                        width: 55,
                        height: 55,
                        backgroundColor: provider.color,
                        boxShadow: `0 6px 20px ${provider.color}30`
                      }}>
                        {provider.icon}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h6" 
                          fontWeight="bold" 
                          color="black"
                          sx={{ 
                            fontSize: '1.25rem',
                            mb: 0.5
                          }}
                        >
                          {provider.name}
                        </Typography>
                        <Chip 
                          label={provider.type} 
                          size="small" 
                          sx={{ 
                            backgroundColor: `${provider.color}15`,
                            color: provider.color,
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            height: 24
                          }} 
                        />
                      </Box>
                    </Stack>

                    {/* Key Details */}
                    <Box sx={{ flex: 1, display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <Box sx={{ textAlign: 'center', minWidth: '120px' }}>
                        <Typography variant="body2" color="#666" fontWeight="500" sx={{ mb: 0.5 }}>
                          Interest Rate
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color={provider.color}>
                          {provider.interestRate}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', minWidth: '120px' }}>
                        <Typography variant="body2" color="#666" fontWeight="500" sx={{ mb: 0.5 }}>
                          Max Amount
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color="black">
                          {provider.maxAmount}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', minWidth: '120px' }}>
                        <Typography variant="body2" color="#666" fontWeight="500" sx={{ mb: 0.5 }}>
                          Processing Fee
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color="black">
                          {provider.processingFee}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Features */}
                    <Box sx={{ minWidth: '180px' }}>
                      <Stack spacing={1}>
                        {provider.features.slice(0, 2).map((feature, featureIndex) => (
                          <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon sx={{ color: provider.color, fontSize: 16 }} />
                            <Typography 
                              variant="body2" 
                              color="#666"
                              sx={{ 
                                fontSize: '0.875rem',
                                lineHeight: 1.4
                              }}
                            >
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Government Schemes */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              color="black" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                lineHeight: 1.2
              }}
            >
              Government Interest Subsidy Schemes
            </Typography>
            <Typography 
              variant="h6" 
              color="#666" 
              sx={{ 
                mb: 5, 
                textAlign: 'center', 
                maxWidth: '700px', 
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.25rem' },
                lineHeight: 1.6
              }}
            >
              Take advantage of government schemes that provide interest subsidies for education loans.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
            {governmentSchemes.map((scheme, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                <Card sx={{
                  height: '100%',
                  borderRadius: '24px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  border: '2px solid #FF6B35',
                  background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(255, 107, 53, 0.03) 100%)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 60px rgba(255, 107, 53, 0.2)',
                    border: '2px solid #FF6B35',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 100%)',
                  }
                }}>
                  <CardContent sx={{ p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                      <Avatar sx={{
                        width: { xs: 50, md: 60 },
                        height: { xs: 50, md: 60 },
                        backgroundColor: '#FF6B35',
                        boxShadow: '0 8px 24px rgba(255, 107, 53, 0.3)'
                      }}>
                        {scheme.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h5" 
                          fontWeight="bold" 
                          color="black" 
                          sx={{ 
                            mb: 0.5,
                            fontSize: { xs: '1.25rem', md: '1.5rem' }
                          }}
                        >
                          {scheme.name}
                        </Typography>
                      </Box>
                    </Stack>

                    <Typography 
                      variant="body1" 
                      color="#666" 
                      sx={{ 
                        mb: 3,
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        lineHeight: 1.6
                      }}
                    >
                      {scheme.description}
                    </Typography>

                    <Box sx={{ 
                      mb: 3, 
                      p: 2, 
                      backgroundColor: 'rgba(255, 107, 53, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 107, 53, 0.2)'
                    }}>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold" 
                        color="#FF6B35" 
                        sx={{ 
                          mb: 1,
                          fontSize: { xs: '1rem', md: '1.1rem' }
                        }}
                      >
                        {scheme.benefit}
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="body2" 
                        color="#666"
                        sx={{ 
                          fontSize: { xs: '0.8rem', md: '0.875rem' },
                          lineHeight: 1.5
                        }}
                      >
                        <strong>Eligibility:</strong> {scheme.eligibility}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Application Process */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              color="black" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                lineHeight: 1.2
              }}
            >
              Education Loan Application Process
            </Typography>
            <Typography 
              variant="h6" 
              color="#666" 
              sx={{ 
                mb: 5, 
                textAlign: 'center', 
                maxWidth: '700px', 
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.25rem' },
                lineHeight: 1.6
              }}
            >
              Follow these simple steps to apply for your education loan and get quick approval.
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', xl: 'row' },
            alignItems: { xs: 'center', xl: 'flex-start' },
            justifyContent: 'center',
            gap: { xs: 4, xl: 2 },
            px: { xs: 2, xl: 4 },
            maxWidth: '1200px',
            mx: 'auto'
          }}>
            {applicationSteps.map((step, index) => (
              <React.Fragment key={index}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', xl: 'column' },
                  alignItems: 'center',
                  textAlign: { xs: 'left', xl: 'center' },
                  flex: { xs: 'none', xl: 1 },
                  width: { xs: '100%', xl: 'auto' },
                  maxWidth: { xs: '500px', xl: '200px' },
                  gap: { xs: 3, xl: 0 }
                }}>
                  <Box
                    sx={{
                      width: { xs: 60, xl: 80 },
                      height: { xs: 60, xl: 80 },
                      minWidth: { xs: 60, xl: 80 },
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: { xs: '1.5rem', xl: '2rem' },
                      boxShadow: '0 8px 32px rgba(255, 107, 53, 0.4)',
                      mb: { xs: 0, xl: 3 },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 12px 40px rgba(255, 107, 53, 0.6)'
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        right: -2,
                        bottom: -2,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        zIndex: -1,
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      },
                      '&:hover::before': {
                        opacity: 0.3
                      }
                    }}
                  >
                    {step.step}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      color="black" 
                      sx={{ 
                        mb: 1,
                        fontSize: { xs: '1.1rem', xl: '1.25rem' }
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="#666" 
                      sx={{ 
                        lineHeight: 1.5,
                        fontSize: { xs: '0.875rem', xl: '0.9375rem' }
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
                {index < applicationSteps.length - 1 && (
                  <Box sx={{
                    display: { xs: 'none', xl: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 3,
                    height: '80px'
                  }}>
                    <ArrowForwardIcon sx={{ 
                      fontSize: 32, 
                      color: '#FF6B35',
                      opacity: 0.7,
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': {
                          transform: 'translateX(0)',
                          opacity: 0.7
                        },
                        '50%': {
                          transform: 'translateX(8px)',
                          opacity: 1
                        }
                      }
                    }} />
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              color="black" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                lineHeight: 1.2
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography 
              variant="h6" 
              color="#666" 
              sx={{ 
                mb: 5, 
                textAlign: 'center', 
                maxWidth: '700px', 
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.25rem' },
                lineHeight: 1.6
              }}
            >
              Find answers to common questions about education loans in India.
            </Typography>
          </Box>

          <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
            {faqItems.map((item, index) => (
              <Accordion key={index} sx={{ 
                mb: 3, 
                borderRadius: '16px !important',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255, 107, 53, 0.1)',
                '&:before': { display: 'none' },
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(255, 107, 53, 0.2)',
                }
              }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#FF6B35' }} />}
                  sx={{
                    backgroundColor: 'rgba(255, 107, 53, 0.03)',
                    borderRadius: '16px 16px 0 0',
                    py: 2,
                    '&.Mui-expanded': {
                      borderRadius: '16px 16px 0 0',
                      backgroundColor: 'rgba(255, 107, 53, 0.05)',
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    color="black"
                    sx={{ 
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      lineHeight: 1.4
                    }}
                  >
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0 0 16px 16px',
                  pt: 1,
                  pb: 3
                }}>
                  <Typography 
                    variant="body1" 
                    color="#666" 
                    sx={{ 
                      lineHeight: 1.7,
                      fontSize: { xs: '0.9rem', md: '1rem' }
                    }}
                  >
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* Call to Action */}
        <Box sx={{ 
          textAlign: 'center', 
          backgroundColor: 'white', 
          borderRadius: '32px', 
          p: { xs: 4, md: 6 },
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255, 107, 53, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 100%)',
          }
        }}>
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            color="black" 
            sx={{ 
              mb: 2,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              lineHeight: 1.2
            }}
          >
            Ready to Finance Your Education?
          </Typography>
          <Typography 
            variant="h6" 
            color="#666" 
            sx={{ 
              mb: 5, 
              maxWidth: '700px', 
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' },
              lineHeight: 1.6
            }}
          >
            Get personalized education loan guidance from our financial experts. 
            Compare rates, understand eligibility, and apply for the best loan options.
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            justifyContent="center" 
            alignItems="center"
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={openLogin}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                px: { xs: 4, md: 5 },
                py: 2,
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 'bold',
                borderRadius: '25px',
                minWidth: { xs: '100%', sm: 'auto' },
                boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 40px rgba(255, 107, 53, 0.4)',
                }
              }}
            >
              Get Loan Assistance
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={openLogin}
              sx={{
                borderColor: '#FF6B35',
                color: '#FF6B35',
                px: { xs: 4, md: 5 },
                py: 2,
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 'bold',
                borderRadius: '25px',
                minWidth: { xs: '100%', sm: 'auto' },
                borderWidth: '2px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: '#FF6B35',
                  backgroundColor: 'rgba(255, 107, 53, 0.08)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.2)',
                }
              }}
            >
              Compare Loan Options
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default EducationLoansPage;
