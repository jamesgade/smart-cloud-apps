import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Chip, Button } from '@mui/material';
import { useAuthModal } from '../contexts/AuthModalContext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ScienceIcon from '@mui/icons-material/Science';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FlightIcon from '@mui/icons-material/Flight';

const BlogsPage = () => {
  const { openLogin } = useAuthModal();
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const blogs = [
    {
      title: "Top 10 Engineering Colleges in India 2026",
      excerpt: "Discover the best engineering colleges that offer world-class education and excellent placement opportunities.",
      author: "Campus Yatra Team",
      date: "March 15, 2026",
      category: "Education",
      image: <SchoolIcon sx={{ fontSize: 32, color: '#FF6B35' }} />,
      readTime: "5 min read"
    },
    {
      title: "How to Prepare for JEE Main 2026",
      excerpt: "Complete guide to crack JEE Main with expert tips, study plans, and preparation strategies.",
      author: "Dr. Rajesh Kumar",
      date: "March 10, 2026",
      category: "Entrance Exams",
      image: <MenuBookIcon sx={{ fontSize: 32, color: '#FF6B35' }} />,
      readTime: "8 min read"
    },
    {
      title: "Scholarship Guide for Students 2026-27",
      excerpt: "Everything you need to know about applying for scholarships and securing financial aid.",
      author: "Priya Sharma",
      date: "March 5, 2026",
      category: "Scholarships",
      image: <AccountBalanceWalletIcon sx={{ fontSize: 32, color: '#FF6B35' }} />,
      readTime: "6 min read"
    },
    {
      title: "Career Options After 12th Science",
      excerpt: "Explore diverse career paths available for science students beyond traditional engineering and medicine.",
      author: "Career Counselor",
      date: "February 28, 2026",
      category: "Career Guidance",
      image: <ScienceIcon sx={{ fontSize: 32, color: '#FF6B35' }} />,
      readTime: "7 min read"
    },
    {
      title: "NEET 2026: Complete Preparation Strategy",
      excerpt: "Master NEET preparation with our comprehensive guide covering syllabus, time management, and mock tests.",
      author: "Dr. Anjali Mehta",
      date: "February 25, 2026",
      category: "Medical",
      image: <LocalHospitalIcon sx={{ fontSize: 32, color: '#FF6B35' }} />,
      readTime: "10 min read"
    },
    {
      title: "Study Abroad: Top Destinations for Indian Students",
      excerpt: "Compare popular study abroad destinations, costs, scholarships, and application processes.",
      author: "International Education Expert",
      date: "February 20, 2026",
      category: "Study Abroad",
      image: <FlightIcon sx={{ fontSize: 32, color: '#FF6B35' }} />,
      readTime: "9 min read"
    },
  ];

  const categories = ["All", "Education", "Entrance Exams", "Scholarships", "Career Guidance", "Medical", "Study Abroad"];

  // Filter blogs based on selected category
  const filteredBlogs = selectedCategory === "All" 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 8 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" fontWeight="900" color="black" sx={{ mb: 2 }}>
            Education Insights & Articles
          </Typography>
          <Typography variant="h6" color="#666" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Stay updated with the latest trends, tips, and guides for your education journey
          </Typography>
        </Box>

        {/* Categories */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {categories.map((category, index) => (
              <Chip
                key={index}
                label={category}
                clickable
                onClick={() => setSelectedCategory(category)}
                sx={{
                  backgroundColor: selectedCategory === category ? '#FF6B35' : 'white',
                  color: selectedCategory === category ? 'white' : '#666',
                  fontWeight: 'bold',
                  px: 2,
                  py: 1,
                  fontSize: '0.9rem',
                  '&:hover': {
                    backgroundColor: selectedCategory === category ? '#FF8C42' : 'rgba(255, 107, 53, 0.1)',
                    color: selectedCategory === category ? 'white' : '#FF6B35',
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Blog List */}
        <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
          {filteredBlogs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="#666">
                No articles found for "{selectedCategory}" category.
              </Typography>
            </Box>
          ) : (
            filteredBlogs.map((blog, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: 'white',
                borderRadius: '16px',
                p: 4,
                mb: 3,
                border: '1px solid rgba(255, 107, 53, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  border: '2px solid #FF6B35',
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.15)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                {/* Blog Icon */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    minWidth: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 147, 30, 0.1) 100%)',
                    borderRadius: '12px',
                    flexShrink: 0
                  }}
                >
                  {blog.image}
                </Box>

                {/* Blog Content */}
                <Box sx={{ flex: 1 }}>
                  {/* Category */}
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={blog.category}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 107, 53, 0.1)',
                        color: '#FF6B35',
                        fontWeight: 'bold',
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>

                  {/* Title */}
                  <Typography 
                    variant="h5" 
                    fontWeight="bold" 
                    color="black" 
                    sx={{ 
                      mb: 2,
                      fontSize: '1.4rem',
                      lineHeight: '1.3',
                      '&:hover': {
                        color: '#FF6B35'
                      }
                    }}
                  >
                    {blog.title}
                  </Typography>

                  {/* Excerpt */}
                  <Typography 
                    variant="body1" 
                    color="#666" 
                    sx={{ 
                      mb: 3,
                      lineHeight: '1.6',
                      fontSize: '1rem'
                    }}
                  >
                    {blog.excerpt}
                  </Typography>

                  {/* Meta Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ fontSize: 18, color: '#666', mr: 1 }} />
                        <Typography variant="body2" color="#666" sx={{ fontSize: '0.9rem' }}>
                          {blog.author}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarTodayIcon sx={{ fontSize: 18, color: '#666', mr: 1 }} />
                        <Typography variant="body2" color="#666" sx={{ fontSize: '0.9rem' }}>
                          {blog.date}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="#FF6B35" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
                        {blog.readTime}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={openLogin}
                      sx={{
                        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        px: 3,
                        py: 1,
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                          transform: 'translateY(-1px)',
                        }
                      }}
                    >
                      Read More
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
          )}
        </Box>

        {/* Load More Button */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={openLogin}
            sx={{
              borderColor: '#FF6B35',
              color: '#FF6B35',
              fontWeight: 'bold',
              px: 6,
              py: 1.5,
              borderRadius: '25px',
              '&:hover': {
                borderColor: '#FF6B35',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
              }
            }}
          >
            Load More Articles
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogsPage;

