import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
  Tabs,
  Tab,
  Paper,
  Pagination,
  Divider,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Article as ArticleIcon,
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingIcon,
  NewReleases as NewIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router';
import axios from 'axios';
import { API_BASE_URL } from '../../libs/constants';

interface Blog {
  blogId: string;
  heading: string;
  tagline?: string;
  slug: string;
  category?: string;
  tags?: string;
  viewCount: number;
  publishedAt: string;
  authorName?: string;
}

const BlogsListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const blogsPerPage = 10;

  // Determine if this is a public or private route
  const isPublicRoute = location.pathname.startsWith('/blogs');

  // Debounced search
  useEffect(() => {
    if (searchTerm.length > 0 && searchTerm.length < 3) {
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchBlogs();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedTab, page]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      let response;

      if (searchTerm.length >= 3) {
        // API search
        response = await axios.get(`${API_BASE_URL}/blogs/public/search`, {
          params: { q: searchTerm }
        });
        setBlogs(response?.data || []);
        setTotalPages(Math.ceil((response?.data?.length || 0) / blogsPerPage));
      } else {
        // Regular fetch
        if (selectedTab === 0) {
          response = await axios.get(`${API_BASE_URL}/blogs/public/recent?limit=100`);
        } else {
          response = await axios.get(`${API_BASE_URL}/blogs/public/featured?limit=100`);
        }
        setBlogs(response?.data || []);
        setTotalPages(Math.ceil((response?.data?.length || 0) / blogsPerPage));
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPageBlogs = () => {
    const startIndex = (page - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    return blogs.slice(startIndex, endIndex);
  };

  const handleBlogClick = (slug: string) => {
    if (isPublicRoute) {
      navigate(`/blog/${slug}`);
    } else {
      navigate(`/latest-news/${slug}`);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 6 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box mb={5} textAlign="center">
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{
              color: '#333',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Blogs & <Box component="span" sx={{ color: '#ff6b35' }}>Latest News</Box>
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Stay updated with educational insights, admission tips, and campus news
          </Typography>
        </Box>

        {/* Search Bar */}
        <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
          <TextField
            fullWidth
            placeholder="Search blogs... (type at least 3 characters)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#ff6b35' }} />
                  </InputAdornment>
                ),
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '&:hover fieldset': {
                  borderColor: '#ff6b35',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b35',
                },
              },
            }}
          />
          {searchTerm.length > 0 && searchTerm.length < 3 && (
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Type at least 3 characters to search
            </Typography>
          )}
        </Paper>

        {/* Tabs */}
        <Paper elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                py: 2,
              },
              '& .Mui-selected': {
                color: '#ff6b35',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#ff6b35',
                height: 3,
              },
            }}
          >
            <Tab icon={<NewIcon />} iconPosition="start" label="Recent Posts" />
            <Tab icon={<TrendingIcon />} iconPosition="start" label="Popular" />
          </Tabs>
        </Paper>

        {/* Loading State */}
        {loading && (
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px" gap={2}>
            <CircularProgress sx={{ color: '#ff6b35' }} size={50} />
            <Typography variant="body1" color="textSecondary">Loading blogs...</Typography>
          </Box>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && (
          <Paper elevation={3} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <ArticleIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {searchTerm ? 'No blogs found matching your search' : 'No blogs available'}
            </Typography>
            {searchTerm && (
              <Button
                variant="outlined"
                onClick={() => setSearchTerm('')}
                sx={{
                  mt: 2,
                  borderColor: '#ff6b35',
                  color: '#ff6b35',
                  '&:hover': {
                    borderColor: '#ff5722',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  }
                }}
              >
                Clear Search
              </Button>
            )}
          </Paper>
        )}

        {/* Blog List */}
        {!loading && blogs.length > 0 && (
          <Stack spacing={3}>
            {getCurrentPageBlogs().map((blog) => (
              <Paper
                key={blog.blogId}
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(255, 107, 53, 0.15)',
                  },
                }}
              >
                <Box display="flex" flexDirection="column" gap={2}>
                  {/* Category & Date */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                    {blog.category && (
                      <Chip
                        label={blog.category}
                        size="small"
                        sx={{
                          backgroundColor: '#fff3e0',
                          color: '#ff6b35',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    )}
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <CalendarIcon fontSize="small" sx={{ color: '#999' }} />
                      <Typography variant="caption" color="textSecondary">
                        {formatDate(blog.publishedAt)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                      color: '#333',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#ff6b35',
                      },
                    }}
                    onClick={() => handleBlogClick(blog.slug)}
                  >
                    {blog.heading}
                  </Typography>

                  {/* Tagline */}
                  {blog.tagline && (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{
                        lineHeight: 1.6,
                      }}
                    >
                      {blog.tagline}
                    </Typography>
                  )}

                  <Divider />

                  {/* Footer - Tags, Views, Button */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      {/* Tags */}
                      {blog.tags && (
                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                          {blog.tags.split(',').slice(0, 2).map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag.trim()}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.7rem',
                                borderColor: '#ddd',
                                color: '#666',
                              }}
                            />
                          ))}
                        </Box>
                      )}
                      {/* Views */}
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <ViewIcon fontSize="small" sx={{ color: '#999' }} />
                        <Typography variant="caption" color="textSecondary">
                          {blog.viewCount}
                        </Typography>
                      </Box>
                    </Box>

                    {/* View Full Article Button */}
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => handleBlogClick(blog.slug)}
                      sx={{
                        backgroundColor: '#ff6b35',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: '#ff5722',
                        },
                      }}
                    >
                      View Full Article
                    </Button>
                  </Box>
                </Box>
              </Paper>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4} mb={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: '1rem',
                      fontWeight: 600,
                    },
                    '& .Mui-selected': {
                      backgroundColor: '#ff6b35 !important',
                      color: 'white',
                    },
                    '& .MuiPaginationItem-root:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    },
                  }}
                />
              </Box>
            )}

            {/* Results Info */}
            <Typography variant="body2" color="textSecondary" textAlign="center">
              Showing {((page - 1) * blogsPerPage) + 1} - {Math.min(page * blogsPerPage, blogs.length)} of {blogs.length} blogs
            </Typography>
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default BlogsListPage;
