CREATE TABLE IF NOT EXISTS common.blog_images (
    image_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_id uuid NOT NULL REFERENCES common.blogs(blog_id) ON DELETE CASCADE,
    image_url varchar(1000) NOT NULL,             -- Full S3 URL or CDN URL
    alt_text varchar(500),                        -- SEO friendly alt text
    caption text,                                 -- Optional caption under image (if needed)
    image_order int DEFAULT 1,                    -- Controls display order
    is_featured boolean DEFAULT false,            -- Optional: mark one image as featured
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by varchar(150),
    updated_by varchar(150)
);
