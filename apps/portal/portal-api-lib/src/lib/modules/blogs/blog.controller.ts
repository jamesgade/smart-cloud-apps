import { Controller, UseGuards, Get, Query, Param, Post, Body, Delete, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { BlogImageService, UploadBlogImageDto, UploadBlogImageFileDto } from './blog-image.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Crud, CrudController } from '@dataui/crud';
import { Blog, BlogImage } from '@smart-cloud-apps/common-api-lib';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam, ApiBody, ApiResponse, ApiConsumes } from '@nestjs/swagger';

@Controller('blogs')
@ApiTags('Blogs')
export class BlogController implements CrudController<Blog> {
  constructor(
    public service: BlogService,
    private readonly blogImageService: BlogImageService
  ) {}

  // Public endpoints (no auth required)

  @Get('public/published')
  @ApiOperation({ description: 'Get all published blogs (public)' })
  @ApiQuery({ name: 'limit', description: 'Number of blogs to return', required: false })
  async getPublishedBlogs(@Query('limit') limit?: number) {
    return this.service.getPublishedBlogs(limit ? parseInt(String(limit)) : 10);
  }

  @Get('public/slug/:slug')
  @ApiOperation({ description: 'Get blog by slug (public)' })
  @ApiParam({ name: 'slug', description: 'Blog slug' })
  async getBlogBySlug(@Param('slug') slug: string) {
    return this.service.getBlogBySlug(slug);
  }

  @Get('public/category/:category')
  @ApiOperation({ description: 'Get blogs by category (public)' })
  @ApiParam({ name: 'category', description: 'Category name' })
  @ApiQuery({ name: 'limit', description: 'Number of blogs to return', required: false })
  async getBlogsByCategory(
    @Param('category') category: string,
    @Query('limit') limit?: number
  ) {
    return this.service.getBlogsByCategory(category, limit ? parseInt(String(limit)) : 10);
  }

  @Get('public/search')
  @ApiOperation({ description: 'Search blogs (public)' })
  @ApiQuery({ name: 'q', description: 'Search term', required: true })
  async searchBlogs(@Query('q') searchTerm: string) {
    return this.service.searchBlogs(searchTerm);
  }

  @Get('public/featured')
  @ApiOperation({ description: 'Get featured blogs (public)' })
  @ApiQuery({ name: 'limit', description: 'Number of blogs to return', required: false })
  async getFeaturedBlogs(@Query('limit') limit?: number) {
    return this.service.getFeaturedBlogs(limit ? parseInt(String(limit)) : 5);
  }

  @Get('public/recent')
  @ApiOperation({ description: 'Get recent blogs (public)' })
  @ApiQuery({ name: 'limit', description: 'Number of blogs to return', required: false })
  async getRecentBlogs(@Query('limit') limit?: number) {
    return this.service.getRecentBlogs(limit ? parseInt(String(limit)) : 10);
  }

  @Get('public/:blogId/images')
  @ApiOperation({ description: 'Get all images for a blog (public)' })
  @ApiParam({ name: 'blogId', description: 'Blog ID' })
  @ApiResponse({ type: [BlogImage] })
  async getBlogImages(@Param('blogId') blogId: string): Promise<BlogImage[]> {
    return this.blogImageService.getBlogImages(blogId);
  }
}

// Admin-protected CRUD endpoints
@Controller('blogs/admin')
@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Blog,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
  },
  params: {
    id: {
      field: 'blogId',
      type: 'string',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    limit: 10,
    maxLimit: 100,
    join: {
      author: {
        eager: true,
        exclude: ['password'],
      },
    },
    sort: [
      {
        field: 'createdAt',
        order: 'DESC',
      },
    ],
  },
})
@ApiTags('Blogs - Admin')
@ApiBearerAuth('access-token')
export class BlogAdminController implements CrudController<Blog> {
  constructor(
    public service: BlogService,
    private readonly blogImageService: BlogImageService
  ) {}

  @Get('search')
  @ApiOperation({ description: 'Search all blogs (admin)' })
  @ApiQuery({ name: 'q', description: 'Search term', required: true })
  async searchAllBlogs(@Query('q') searchTerm: string) {
    return this.service.searchBlogs(searchTerm);
  }

  @Post('images/upload')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ description: 'Upload image for a blog with file upload (admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload blog image with drag & drop support',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file (drag and drop supported)'
        },
        blogId: { 
          type: 'string', 
          format: 'uuid',
          description: 'Blog ID'
        },
        altText: { 
          type: 'string',
          description: 'Alternative text for accessibility'
        },
        caption: { 
          type: 'string',
          description: 'Image caption'
        },
        imageOrder: { 
          type: 'integer',
          description: 'Display order of the image'
        },
        isFeatured: { 
          type: 'boolean',
          description: 'Mark as featured image'
        }
      },
      required: ['image', 'blogId']
    }
  })
  @ApiResponse({ type: BlogImage })
  async uploadBlogImageFile(
    @UploadedFile() file: any,
    @Body() uploadDto: UploadBlogImageFileDto
  ): Promise<BlogImage> {
    return this.blogImageService.uploadBlogImageFile(file, uploadDto);
  }

  @Post('images/upload-base64')
  @ApiOperation({ description: 'Upload image for a blog with base64 (admin)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        blogId: { type: 'string', format: 'uuid' },
        image: { type: 'string', description: 'Base64 encoded image' },
        altText: { type: 'string' },
        caption: { type: 'string' },
        imageOrder: { type: 'number' },
        isFeatured: { type: 'boolean' }
      },
      required: ['blogId', 'image']
    }
  })
  @ApiResponse({ type: BlogImage })
  async uploadBlogImage(@Body() uploadDto: UploadBlogImageDto): Promise<BlogImage> {
    return this.blogImageService.uploadBlogImage(uploadDto);
  }

  @Get(':blogId/images')
  @ApiOperation({ description: 'Get all images for a blog (admin)' })
  @ApiParam({ name: 'blogId', description: 'Blog ID' })
  @ApiResponse({ type: [BlogImage] })
  async getAdminBlogImages(@Param('blogId') blogId: string): Promise<BlogImage[]> {
    return this.blogImageService.getBlogImages(blogId);
  }

  @Put('images/:imageId')
  @ApiOperation({ description: 'Update blog image (admin)' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        altText: { type: 'string' },
        caption: { type: 'string' },
        imageOrder: { type: 'number' },
        isFeatured: { type: 'boolean' }
      }
    }
  })
  async updateBlogImage(
    @Param('imageId') imageId: string,
    @Body() updateData: Partial<Pick<BlogImage, 'altText' | 'caption' | 'imageOrder' | 'isFeatured'>>
  ): Promise<BlogImage | null> {
    return this.blogImageService.updateBlogImage(imageId, updateData);
  }

  @Delete('images/:imageId')
  @ApiOperation({ description: 'Delete blog image (admin)' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  async deleteBlogImage(@Param('imageId') imageId: string): Promise<{ message: string }> {
    await this.blogImageService.deleteBlogImage(imageId);
    return { message: 'Image deleted successfully' };
  }
}
