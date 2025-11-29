import React from 'react';
import { useTable, useNavigation, usePermissions } from '@refinedev/core';
import CreateBlogModal from './Create';
import EditBlogModal from './Edit';
import ViewBlogModal from './View';
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  TablePagination,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Article as ArticleIcon,
  CheckCircle as PublishedIcon,
  Unpublished as UnpublishedIcon,
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

export const BlogList: React.FC = () => {
  const { show } = useNavigation();
  const { data: permissions } = usePermissions({});

  // Helper function to check permissions with memoization
  const hasPermission = React.useMemo(() => {
    return (permission: string) => {
      return permissions?.data?.some((p: any) => p.actionName === permission) || false;
    };
  }, [permissions]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedBlogId, setSelectedBlogId] = React.useState<string | null>(null);
  const [selectedBlogData, setSelectedBlogData] = React.useState<Blog | null>(null);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { tableQuery, setCurrentPage, currentPage, setPageSize, pageCount, pageSize } = useTable<Blog>({
    resource: 'blogs/admin',
    pagination: {
      current: page + 1,
      pageSize: rowsPerPage,
      mode: 'server',
    },
    syncWithLocation: false,
  });

  const isLoading = tableQuery.isLoading;
  const data = Array.isArray(tableQuery.data?.data?.data) ? tableQuery.data.data?.data : [];
  const total = tableQuery.data?.total || 0;

  const handleChangePage = React.useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleCreateSuccess = React.useCallback(() => {
    tableQuery.refetch();
  }, [tableQuery]);

  const handleEditSuccess = React.useCallback(() => {
    setEditModalOpen(false);
    setSelectedBlogData(null);
    tableQuery.refetch();
  }, [tableQuery]);

  const handleMenuClick = React.useCallback((event: React.MouseEvent<HTMLElement>, blogId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedBlogId(blogId);
  }, []);

  const handleMenuClose = React.useCallback(() => {
    setAnchorEl(null);
    setSelectedBlogId(null);
  }, []);

  const handleEdit = React.useCallback(() => {
    const currentSelectedBlog = data.find((blog: Blog) => blog.blogId === selectedBlogId);

    if (selectedBlogId && currentSelectedBlog) {
      setSelectedBlogData(currentSelectedBlog);
      setEditModalOpen(true);
    }
    handleMenuClose();
  }, [handleMenuClose, selectedBlogId, data]);

  const handleView = React.useCallback(() => {
    const currentSelectedBlog = data.find((blog: Blog) => blog.blogId === selectedBlogId);

    if (selectedBlogId && currentSelectedBlog) {
      setSelectedBlogData(currentSelectedBlog);
      setViewModalOpen(true);
    }
    handleMenuClose();
  }, [selectedBlogId, data, handleMenuClose]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <ArticleIcon sx={{ fontSize: 32, color: '#ff6b35' }} />
              <Typography variant="h5" fontWeight="bold">
                Blog Management
              </Typography>
            </Box>
            {hasPermission('CREATE_BLOG') && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateModalOpen(true)}
                sx={{
                  backgroundColor: '#ff6b35',
                  '&:hover': {
                    backgroundColor: '#ff5722',
                  },
                }}
              >
                Create Blog
              </Button>
            )}
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Heading</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Views</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Published</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="textSecondary">
                        No blogs found. Create your first blog post!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((blog: Blog) => (
                    <TableRow key={blog.blogId} hover>
                      <TableCell>
                        <Tooltip title={blog.heading}>
                          <Typography variant="body2" fontWeight={500}>
                            {truncateText(blog.heading, 40)}
                          </Typography>
                        </Tooltip>
                        {blog.tagline && (
                          <Typography variant="caption" color="textSecondary">
                            {truncateText(blog.tagline, 60)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {blog.category ? (
                          <Chip
                            label={blog.category}
                            size="small"
                            sx={{ backgroundColor: '#e3f2fd' }}
                          />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={blog.isPublished ? <PublishedIcon /> : <UnpublishedIcon />}
                          label={blog.isPublished ? 'Published' : 'Draft'}
                          size="small"
                          color={blog.isPublished ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{blog.viewCount}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {blog.publishedAt ? formatDate(blog.publishedAt) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, blog.blogId)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 1, fontSize: 20 }} />
          View
        </MenuItem>
        {hasPermission('EDIT_BLOG') && (
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1, fontSize: 20 }} />
            Edit
          </MenuItem>
        )}
      </Menu>

      {/* Modals */}
      {createModalOpen && (
        <CreateBlogModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {editModalOpen && selectedBlogData && (
        <EditBlogModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedBlogData(null);
          }}
          onSuccess={handleEditSuccess}
          blogData={selectedBlogData}
        />
      )}

      {viewModalOpen && selectedBlogData && (
        <ViewBlogModal
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedBlogData(null);
          }}
          blogData={selectedBlogData}
        />
      )}
    </Box>
  );
};

export default BlogList;
