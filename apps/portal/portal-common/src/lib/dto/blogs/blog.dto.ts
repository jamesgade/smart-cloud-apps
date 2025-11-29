import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

// Helper function to generate slug from heading
export function generateSlug(heading: string): string {
  return heading
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

// Create Blog DTO
export const CreateBlogSchema = extendApi(
  z.object({
    heading: z.string().min(1, { message: 'Heading is required' }).max(500),
    tagline: z.string().max(1000).optional().nullable(),
    slug: z.string().max(500).optional(), // Auto-generated if not provided
    section1: z.string().optional().nullable(),
    section2: z.string().optional().nullable(),
    section3: z.string().optional().nullable(),
    featuredImageUrl: z.string().max(1000).url().optional().nullable(),
    authorSignature: z.string().optional().nullable(),
    authorName: z.string().max(255).optional().nullable(),
    authorId: z.string().uuid().optional().nullable(),
    isPublished: z.boolean().default(false),
    publishedAt: z.string().datetime().optional().nullable(),
    category: z.string().max(100).optional().nullable(),
    tags: z.string().optional().nullable(), // Comma-separated tags
    metaDescription: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
  }),
  { title: 'Create Blog Schema' }
);

export class CreateBlogDto extends createZodDto(CreateBlogSchema) {}

// Update Blog DTO
export const UpdateBlogSchema = extendApi(
  z.object({
    heading: z.string().min(1).max(500).optional(),
    tagline: z.string().max(1000).optional().nullable(),
    slug: z.string().max(500).optional(),
    section1: z.string().optional().nullable(),
    section2: z.string().optional().nullable(),
    section3: z.string().optional().nullable(),
    featuredImageUrl: z.string().max(1000).url().optional().nullable(),
    authorSignature: z.string().optional().nullable(),
    authorName: z.string().max(255).optional().nullable(),
    authorId: z.string().uuid().optional().nullable(),
    isPublished: z.boolean().optional(),
    publishedAt: z.string().datetime().optional().nullable(),
    category: z.string().max(100).optional().nullable(),
    tags: z.string().optional().nullable(),
    metaDescription: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
  { title: 'Update Blog Schema' }
);

export class UpdateBlogDto extends createZodDto(UpdateBlogSchema) {}

// Blog Response DTO (for API responses)
export const BlogResponseSchema = extendApi(
  z.object({
    blogId: z.string().uuid(),
    heading: z.string(),
    tagline: z.string().nullable(),
    slug: z.string(),
    section1: z.string().nullable(),
    section2: z.string().nullable(),
    section3: z.string().nullable(),
    featuredImageUrl: z.string().nullable(),
    authorSignature: z.string().nullable(),
    authorName: z.string().nullable(),
    authorId: z.string().uuid().nullable(),
    isPublished: z.boolean(),
    publishedAt: z.string().datetime().nullable(),
    category: z.string().nullable(),
    tags: z.string().nullable(),
    viewCount: z.number(),
    metaDescription: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    createdBy: z.string(),
    updatedBy: z.string(),
  }),
  { title: 'Blog Response Schema' }
);

export class BlogResponseDto extends createZodDto(BlogResponseSchema) {}

// Query DTO for filtering blogs
export const BlogQuerySchema = extendApi(
  z.object({
    category: z.string().optional(),
    isPublished: z.boolean().optional(),
    search: z.string().optional(), // Search in heading, tagline
    page: z.number().min(1).default(1).optional(),
    limit: z.number().min(1).max(100).default(10).optional(),
  }),
  { title: 'Blog Query Schema' }
);

export class BlogQueryDto extends createZodDto(BlogQuerySchema) {}
