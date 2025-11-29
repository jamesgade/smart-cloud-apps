import React from 'react';
import { useCreate, useGetIdentity } from '@refinedev/core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
  InputAdornment,
  Chip,
  Alert,
  Stack,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Publish as PublishIcon,
} from '@mui/icons-material';

interface CreateBlogModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const blogSchema = z.object({
  heading: z.string().min(1, 'Heading is required').max(500),
  tagline: z.string().max(1000).optional(),
  section1: z.string().optional(),
  section2: z.string().optional(),
  section3: z.string().optional(),
  authorSignature: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  metaDescription: z.string().optional(),
  isPublished: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type BlogFormData = z.infer<typeof blogSchema>;

const CreateBlogModal: React.FC<CreateBlogModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { mutate: createBlog, isLoading } = useCreate();
  const { data: userData } = useGetIdentity();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      isPublished: false,
      isActive: true,
    },
    mode: 'onChange',
  });

  const isPublished = watch('isPublished');

  const onSubmit = React.useCallback((data: BlogFormData) => {
    // Add author information from current user
    const blogData = {
      ...data,
      authorName: userData?.userName || userData?.firstName + ' ' + userData?.lastName,
      authorId: userData?.userId,
      publishedAt: data.isPublished ? new Date().toISOString() : null,
    };

    createBlog(
      {
        resource: 'blogs/admin',
        values: blogData,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
          onSuccess();
        },
      }
    );
  }, [createBlog, reset, onClose, onSuccess, userData]);

  const handleClose = React.useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <Box display="flex" alignItems="center" gap={2}>
          <ArticleIcon sx={{ color: '#ff6b35', fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            Create New Blog Post
          </Typography>
        </Box>
      </DialogTitle>

      <Divider />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={4}>
            {/* Basic Information */}
            <Box display="flex" flexDirection="column" gap={3}>
              <Typography variant="subtitle2" color="primary">
                Basic Information
              </Typography>

              <Controller
                name="heading"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Heading *"
                    fullWidth
                    error={!!errors.heading}
                    helperText={errors.heading?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ArticleIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="tagline"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tagline"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.tagline}
                    helperText={errors.tagline?.message || 'Short subtitle or description'}
                  />
                )}
              />

              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={3}
              >
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Category"
                      fullWidth
                      error={!!errors.category}
                      helperText={errors.category?.message}
                      placeholder="e.g., Admissions, Scholarships"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CategoryIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1 }}
                    />
                  )}
                />

                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tags"
                      fullWidth
                      error={!!errors.tags}
                      helperText={errors.tags?.message || 'Comma-separated tags'}
                      placeholder="tips, guide, featured"
                      sx={{ flex: 1 }}
                    />
                  )}
                />
              </Box>
            </Box>

            {/* Content Sections */}
            <Box display="flex" flexDirection="column" gap={3}>
              <Typography variant="subtitle2" color="primary">
                Content Sections
              </Typography>

              <Controller
                name="section1"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Section 1"
                    fullWidth
                    multiline
                    rows={6}
                    error={!!errors.section1}
                    helperText={errors.section1?.message || 'Main content section'}
                  />
                )}
              />

              <Controller
                name="section2"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Section 2"
                    fullWidth
                    multiline
                    rows={6}
                    error={!!errors.section2}
                    helperText={errors.section2?.message || 'Additional content section (optional)'}
                  />
                )}
              />

              <Controller
                name="section3"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Section 3"
                    fullWidth
                    multiline
                    rows={6}
                    error={!!errors.section3}
                    helperText={errors.section3?.message || 'Additional content section (optional)'}
                  />
                )}
              />
            </Box>

            {/* SEO & Author */}
            <Box display="flex" flexDirection="column" gap={3}>
              <Typography variant="subtitle2" color="primary">
                SEO & Author
              </Typography>
              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={3}
              >
                <Controller
                  name="metaDescription"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Meta Description"
                      fullWidth
                      multiline
                      rows={3}
                      error={!!errors.metaDescription}
                      helperText={errors.metaDescription?.message || 'SEO description for search engines'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1 }}
                    />
                  )}
                />

                <Controller
                  name="authorSignature"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Author Signature"
                      fullWidth
                      multiline
                      rows={3}
                      error={!!errors.authorSignature}
                      helperText={errors.authorSignature?.message || 'Closing note or signature'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1 }}
                    />
                  )}
                />
              </Box>
            </Box>

            {/* Publishing Options */}
            <Box display="flex" flexDirection="column" gap={3}>
              <Typography variant="subtitle2" color="primary">
                Publishing Options
              </Typography>
              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={3}
              >
                <Controller
                  name="isPublished"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                          color="success"
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <PublishIcon fontSize="small" />
                          <Typography>
                            Publish immediately
                          </Typography>
                        </Box>
                      }
                      sx={{ flex: 1, m: 0 }}
                    />
                  )}
                />

                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      }
                      label="Active"
                      sx={{ flex: 1, m: 0 }}
                    />
                  )}
                />
              </Box>

              {isPublished && (
                <Alert severity="info">
                  This blog will be published and visible to all users immediately.
                </Alert>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <ArticleIcon />}
            sx={{
              backgroundColor: '#ff6b35',
              '&:hover': {
                backgroundColor: '#ff5722',
              },
            }}
          >
            {isLoading ? 'Creating...' : 'Create Blog'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateBlogModal;
