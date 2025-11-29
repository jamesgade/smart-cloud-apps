import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Visibility as ViewIcon,
  CheckCircle as PublishedIcon,
  Unpublished as UnpublishedIcon,
  Category as CategoryIcon,
  Tag as TagIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

interface Blog {
  blogId: string;
  heading: string;
  tagline?: string;
  slug: string;
  section1?: string;
  section2?: string;
  section3?: string;
  featuredImageUrl?: string;
  authorSignature?: string;
  authorName?: string;
  authorId?: string;
  isPublished: boolean;
  publishedAt?: string;
  category?: string;
  tags?: string;
  viewCount: number;
  metaDescription?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ViewBlogModalProps {
  open: boolean;
  onClose: () => void;
  blogData: Blog;
}

const ViewBlogModal: React.FC<ViewBlogModalProps> = ({
  open,
  onClose,
  blogData,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderSection = (title: string, content?: string) => {
    if (!content) return null;
    return (
      <Box mb={3}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
          {content}
        </Typography>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <ArticleIcon sx={{ color: '#ff6b35', fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold">
              Blog Details
            </Typography>
          </Box>
          <Chip
            icon={blogData.isPublished ? <PublishedIcon /> : <UnpublishedIcon />}
            label={blogData.isPublished ? 'Published' : 'Draft'}
            color={blogData.isPublished ? 'success' : 'default'}
          />
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          {/* Featured Image */}
          {blogData.featuredImageUrl && (
            <Box mb={3}>
              <Card>
                <Box
                  component="img"
                  src={blogData.featuredImageUrl}
                  alt={blogData.heading}
                  sx={{
                    width: '100%',
                    maxHeight: 300,
                    objectFit: 'cover',
                  }}
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                  }}
                />
              </Card>
            </Box>
          )}

          {/* Title and Tagline */}
          <Typography variant="h4" gutterBottom fontWeight="bold" color="#ff6b35">
            {blogData.heading}
          </Typography>

          {blogData.tagline && (
            <Typography variant="h6" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
              {blogData.tagline}
            </Typography>
          )}

          {/* Metadata */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2" color="textSecondary">
                  <strong>Author:</strong> {blogData.authorName || 'Unknown'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2" color="textSecondary">
                  <strong>Created:</strong> {formatDate(blogData.createdAt)}
                </Typography>
              </Box>
            </Grid>
            {blogData.publishedAt && (
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="textSecondary">
                    <strong>Published:</strong> {formatDate(blogData.publishedAt)}
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <ViewIcon fontSize="small" color="action" />
                <Typography variant="body2" color="textSecondary">
                  <strong>Views:</strong> {blogData.viewCount}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Category and Tags */}
          <Box mb={3}>
            {blogData.category && (
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CategoryIcon fontSize="small" />
                <Chip label={blogData.category} size="small" color="primary" />
              </Box>
            )}
            {blogData.tags && (
              <Box display="flex" alignItems="flex-start" gap={1}>
                <TagIcon fontSize="small" sx={{ mt: 0.5 }} />
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {blogData.tags.split(',').map((tag, index) => (
                    <Chip key={index} label={tag.trim()} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Content Sections */}
          {renderSection('', blogData.section1)}
          {renderSection('', blogData.section2)}
          {renderSection('', blogData.section3)}

          {/* Author Signature */}
          {blogData.authorSignature && (
            <Box mt={4}>
              <Divider sx={{ mb: 2 }} />
              <Card sx={{ backgroundColor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="body2" fontStyle="italic" sx={{ whiteSpace: 'pre-wrap' }}>
                    {blogData.authorSignature}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* SEO Info */}
          {blogData.metaDescription && (
            <Box mt={3}>
              <Typography variant="caption" color="textSecondary" gutterBottom>
                <strong>SEO Description:</strong>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {blogData.metaDescription}
              </Typography>
            </Box>
          )}

          {/* Slug Info */}
          <Box mt={2}>
            <Typography variant="caption" color="textSecondary">
              <strong>URL Slug:</strong> {blogData.slug}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewBlogModal;
