import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Avatar,
  Button,
  Paper,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Category as CategoryIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router';
import axios from 'axios';
import { API_BASE_URL } from '../../libs/constants';

interface Blog {
  blogId: string;
  heading: string;
  tagline?: string;
  slug: string;
  section1?: string;
  section2?: string;
  section3?: string;
  authorSignature?: string;
  authorName?: string;
  category?: string;
  tags?: string;
  viewCount: number;
  publishedAt: string;
  metaDescription?: string;
}

const BlogDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Determine if this is a private route (latest-news) or public route (blog/blogs)
  const isPrivateRoute = location.pathname.startsWith('/latest-news');

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/blogs/public/slug/${slug}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleBackClick = () => {
    if (isPrivateRoute) {
      navigate('/latest-news');
    } else {
      navigate('/blogs');
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        backgroundColor="#f5f5f5"
      >
        <CircularProgress sx={{ color: '#ff6b35' }} />
      </Box>
    );
  }

  if (error || !blog) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        backgroundColor="#f5f5f5"
      >
        <Typography variant="h4" color="textSecondary" gutterBottom>
          Blog Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3}>
          The blog post you're looking for doesn't exist or has been removed.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{
            backgroundColor: '#ff6b35',
            '&:hover': {
              backgroundColor: '#ff5722',
            },
          }}
        >
          Back to Blogs
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="md">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{
            mb: 3,
            color: '#ff6b35',
            '&:hover': {
              backgroundColor: 'rgba(255, 107, 53, 0.1)',
            },
          }}
        >
          Back to Blogs
        </Button>

        {/* Blog Content */}
        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
          <Box p={4}>
            {/* Category */}
            {blog.category && (
              <Box mb={2}>
                <Chip
                  icon={<CategoryIcon />}
                  label={blog.category}
                  sx={{
                    backgroundColor: '#fff3e0',
                    color: '#ff6b35',
                    fontWeight: 600,
                  }}
                />
              </Box>
            )}

            {/* Title */}
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{ color: '#333', mb: 2 }}
            >
              {blog.heading}
            </Typography>

            {/* Tagline */}
            {blog.tagline && (
              <Typography
                variant="h6"
                color="textSecondary"
                sx={{ mb: 3, fontStyle: 'italic' }}
              >
                {blog.tagline}
              </Typography>
            )}

            {/* Meta Info */}
            <Box
              display="flex"
              flexWrap="wrap"
              gap={3}
              alignItems="center"
              mb={3}
              pb={3}
              borderBottom="2px solid #eee"
            >
              {blog.authorName && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar sx={{ bgcolor: '#ff6b35', width: 32, height: 32 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" fontWeight={500}>
                    {blog.authorName}
                  </Typography>
                </Box>
              )}

              <Box display="flex" alignItems="center" gap={0.5}>
                <CalendarIcon fontSize="small" sx={{ color: '#999' }} />
                <Typography variant="body2" color="textSecondary">
                  {formatDate(blog.publishedAt)}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={0.5}>
                <ViewIcon fontSize="small" sx={{ color: '#999' }} />
                <Typography variant="body2" color="textSecondary">
                  {blog.viewCount} views
                </Typography>
              </Box>
            </Box>

            {/* Tags */}
            {blog.tags && (
              <Box mb={4} display="flex" flexWrap="wrap" gap={1} alignItems="center">
                <TagIcon fontSize="small" sx={{ color: '#999' }} />
                {blog.tags.split(',').map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag.trim()}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: '#ff6b35',
                      color: '#ff6b35',
                    }}
                  />
                ))}
              </Box>
            )}

            <Divider sx={{ mb: 4 }} />

            {/* Content Sections */}
            <Box sx={{ '& p': { lineHeight: 1.8, mb: 2 } }}>
              {blog.section1 && (
                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {blog.section1}
                </Typography>
              )}

              {blog.section2 && (
                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {blog.section2}
                </Typography>
              )}

              {blog.section3 && (
                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {blog.section3}
                </Typography>
              )}
            </Box>

            {/* Author Signature */}
            {blog.authorSignature && (
              <Box mt={6}>
                <Divider sx={{ mb: 3 }} />
                <Card sx={{ backgroundColor: '#f9f9f9' }}>
                  <CardContent>
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: 'italic',
                        whiteSpace: 'pre-wrap',
                        color: '#666',
                      }}
                    >
                      {blog.authorSignature}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Back Button at Bottom */}
        <Box mt={4} display="flex" justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{
              borderColor: '#ff6b35',
              color: '#ff6b35',
              '&:hover': {
                borderColor: '#ff5722',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
              },
            }}
          >
            Back to All Blogs
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogDetailPage;
