-- =====================================================
-- Blog/News Management System
-- Version: V01_036
-- Description: Creates blogs table for blog posts and news articles
-- Schema: common (for public content)
-- =====================================================

-- Blogs/News Articles Table
CREATE TABLE IF NOT EXISTS common.blogs (
    blog_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,

    -- Basic Info
    heading varchar(500) NOT NULL,
    tagline varchar(1000),
    slug varchar(500) NOT NULL UNIQUE,

    -- Content Sections (stored as TEXT, can be rich HTML/Markdown)
    section_1 text,
    section_2 text,
    section_3 text,

    -- Featured Image
    -- featured_image_url varchar(1000),

    -- Author Information
    author_signature text,
    author_name varchar(255),
    author_id uuid REFERENCES auth."user"(user_id) ON DELETE SET NULL,

    -- Publishing
    is_published boolean DEFAULT false NOT NULL,
    published_at timestamp,

    -- Additional Metadata
    category varchar(100), -- e.g., 'Admissions', 'Scholarships', 'Career Guidance'
    tags text, -- Comma-separated tags
    view_count integer DEFAULT 0,

    -- SEO
    meta_description text,

    -- Audit Fields
    is_active boolean DEFAULT true NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_blog_id ON common.blogs(blog_id);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON common.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_is_published ON common.blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON common.blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON common.blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON common.blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_is_active ON common.blogs(is_active);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON common.blogs(created_at DESC);

-- Comments for documentation
COMMENT ON TABLE common.blogs IS 'Stores blog posts and news articles for Campus Yatra platform';
COMMENT ON COLUMN common.blogs.heading IS 'Main title/heading of the blog post';
COMMENT ON COLUMN common.blogs.tagline IS 'Short subtitle or tagline';
COMMENT ON COLUMN common.blogs.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN common.blogs.section_1 IS 'First content section (supports HTML/Markdown)';
COMMENT ON COLUMN common.blogs.section_2 IS 'Second content section (supports HTML/Markdown)';
COMMENT ON COLUMN common.blogs.section_3 IS 'Third content section (supports HTML/Markdown)';
COMMENT ON COLUMN common.blogs.is_published IS 'Whether the blog is publicly visible';
COMMENT ON COLUMN common.blogs.published_at IS 'Timestamp when the blog was published';

-- Add permissions for blog management
INSERT INTO auth.permissions
    (permission_id, NAME, created_by, updated_by, description, action, condition, object_id, request_method, override_object_url, path)
VALUES
    ('f8a9d123-4567-89ab-cdef-123456789abc', 'Blog Management Menu', 'ADMIN', 'ADMIN', 'Access to blog management section', 'BLOG_MANAGEMENT_MENU', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', '', false, ''),
    ('f8a9d123-4567-89ab-cdef-123456789abd', 'View Blogs', 'ADMIN', 'ADMIN', 'View all blogs', 'VIEW_BLOGS', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', '', false, ''),
    ('f8a9d123-4567-89ab-cdef-123456789abe', 'Create Blog', 'ADMIN', 'ADMIN', 'Create new blog posts', 'CREATE_BLOG', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', '', false, ''),
    ('f8a9d123-4567-89ab-cdef-123456789abf', 'Edit Blog', 'ADMIN', 'ADMIN', 'Edit existing blog posts', 'EDIT_BLOG', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', '', false, ''),
    ('f8a9d123-4567-89ab-cdef-123456789ac0', 'Delete Blog', 'ADMIN', 'ADMIN', 'Delete blog posts', 'DELETE_BLOG', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', '', false, ''),
    ('f8a9d123-4567-89ab-cdef-123456789ac1', 'Blogs Menu', 'ADMIN', 'ADMIN', 'Access to blogs viewing section for students', 'BLOGS_MENU', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', '', false, '')
ON CONFLICT (permission_id) DO NOTHING;

-- Assign all blog permissions to Admin role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f8a9d123-4567-89ab-cdef-123456789abc', 'ADMIN', 'ADMIN'), -- Blog Management Menu
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f8a9d123-4567-89ab-cdef-123456789abd', 'ADMIN', 'ADMIN'), -- View Blogs
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f8a9d123-4567-89ab-cdef-123456789abe', 'ADMIN', 'ADMIN'), -- Create Blog
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f8a9d123-4567-89ab-cdef-123456789abf', 'ADMIN', 'ADMIN'), -- Edit Blog
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f8a9d123-4567-89ab-cdef-123456789ac0', 'ADMIN', 'ADMIN'), -- Delete Blog
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f8a9d123-4567-89ab-cdef-123456789ac1', 'ADMIN', 'ADMIN')  -- Blogs Menu
ON CONFLICT DO NOTHING;

-- Assign Blog Management Menu to Manager, Senior Counsellor, and Counsellor (NOT Student)
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'f8a9d123-4567-89ab-cdef-123456789abc', 'ADMIN', 'ADMIN'), -- Manager - Blog Management Menu
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f8a9d123-4567-89ab-cdef-123456789abc', 'ADMIN', 'ADMIN'), -- Senior Counsellor - Blog Management Menu
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f8a9d123-4567-89ab-cdef-123456789abc', 'ADMIN', 'ADMIN'), -- Counsellor - Blog Management Menu
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'f8a9d123-4567-89ab-cdef-123456789abd', 'ADMIN', 'ADMIN'), -- Manager - View Blogs
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f8a9d123-4567-89ab-cdef-123456789abd', 'ADMIN', 'ADMIN'), -- Senior Counsellor - View Blogs
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f8a9d123-4567-89ab-cdef-123456789abd', 'ADMIN', 'ADMIN'), -- Counsellor - View Blogs
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'f8a9d123-4567-89ab-cdef-123456789abe', 'ADMIN', 'ADMIN'), -- Manager - Create Blog
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f8a9d123-4567-89ab-cdef-123456789abe', 'ADMIN', 'ADMIN'), -- Senior Counsellor - Create Blog
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f8a9d123-4567-89ab-cdef-123456789abe', 'ADMIN', 'ADMIN'), -- Counsellor - Create Blog
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'f8a9d123-4567-89ab-cdef-123456789abf', 'ADMIN', 'ADMIN'), -- Manager - Edit Blog
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f8a9d123-4567-89ab-cdef-123456789abf', 'ADMIN', 'ADMIN'), -- Senior Counsellor - Edit Blog
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f8a9d123-4567-89ab-cdef-123456789abf', 'ADMIN', 'ADMIN'), -- Counsellor - Edit Blog
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'f8a9d123-4567-89ab-cdef-123456789ac0', 'ADMIN', 'ADMIN'), -- Manager - Delete Blog
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f8a9d123-4567-89ab-cdef-123456789ac0', 'ADMIN', 'ADMIN'), -- Senior Counsellor - Delete Blog
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f8a9d123-4567-89ab-cdef-123456789ac0', 'ADMIN', 'ADMIN')  -- Counsellor - Delete Blog
ON CONFLICT DO NOTHING;

-- Assign Latest News Menu permission to all roles (students can view blogs at /latest-news)
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'f8a9d123-4567-89ab-cdef-123456789ac1', 'ADMIN', 'ADMIN'), -- Manager
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f8a9d123-4567-89ab-cdef-123456789ac1', 'ADMIN', 'ADMIN'), -- Senior Counsellor
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f8a9d123-4567-89ab-cdef-123456789ac1', 'ADMIN', 'ADMIN'), -- Counsellor
    ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', 'f8a9d123-4567-89ab-cdef-123456789ac1', 'ADMIN', 'ADMIN')  -- Student
ON CONFLICT DO NOTHING;
