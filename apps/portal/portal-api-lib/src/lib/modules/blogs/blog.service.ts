import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uniq } from 'lodash';
import { Blog } from '@smart-cloud-apps/common-api-lib';
import { QueryOptions } from '@dataui/crud';
import { ParsedRequestParams } from '@dataui/crud-request';
import { CrudRequest } from '@dataui/crud';
import { generateSlug } from '@smart-cloud-apps/portal-common';

@Injectable()
export class BlogService extends TypeOrmCrudService<Blog> {
  override getSelect(query: ParsedRequestParams, options: QueryOptions) {
    return uniq(super.getSelect(query, options));
  }

  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>
  ) {
    super(blogRepository);
  }

  override async createOne(req: CrudRequest, dto: Partial<Blog>): Promise<Blog> {
    // Auto-generate slug if not provided
    if (!dto.slug && dto.heading) {
      dto.slug = await this.generateUniqueSlug(dto.heading);
    }

    // Set published_at if publishing
    if (dto.isPublished && !dto.publishedAt) {
      dto.publishedAt = new Date();
    }

    // Add audit fields
    const entityToSave = {
      ...dto,
      createdBy: req.parsed?.authPersist?.['userId'] || 'system',
      updatedBy: req.parsed?.authPersist?.['userId'] || 'system',
    };

    return super.createOne(req, entityToSave);
  }

  override async updateOne(req: CrudRequest, dto: Partial<Blog>): Promise<Blog> {
    // Update slug if heading changed
    if (dto.heading && !dto.slug) {
      dto.slug = await this.generateUniqueSlug(dto.heading);
    }

    // Set published_at when publishing
    if (dto.isPublished) {
      const existing = await this.blogRepository.findOne({
        where: { blogId: req.parsed.paramsFilter[0].value },
      });
      if (existing && !existing.isPublished && !dto.publishedAt) {
        dto.publishedAt = new Date();
      }
    }

    // Add audit fields
    const entityToUpdate = {
      ...dto,
      updatedBy: req.parsed?.authPersist?.['userId'] || 'system',
    };

    return super.updateOne(req, entityToUpdate);
  }

  /**
   * Generate unique slug from heading
   */
  private async generateUniqueSlug(heading: string): Promise<string> {
    let slug = generateSlug(heading);
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
      const existing = await this.blogRepository.findOne({ where: { slug } });
      if (!existing) {
        isUnique = true;
      } else {
        slug = `${generateSlug(heading)}-${counter}`;
        counter++;
      }
    }

    return slug;
  }

  /**
   * Get published blogs only
   */
  async getPublishedBlogs(limit: number = 10): Promise<Blog[]> {
    return this.blogRepository.find({
      where: { isPublished: true, isActive: true },
      order: { publishedAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get blog by slug (public endpoint)
   */
  async getBlogBySlug(slug: string): Promise<Blog | null> {
    const blog = await this.blogRepository.findOne({
      where: { slug, isPublished: true, isActive: true },
      relations: ['author'],
    });

    // Increment view count
    if (blog) {
      await this.blogRepository.update(
        { blogId: blog.blogId },
        { viewCount: blog.viewCount + 1 }
      );
    }

    return blog;
  }

  /**
   * Get blogs by category
   */
  async getBlogsByCategory(category: string, limit: number = 10): Promise<Blog[]> {
    return this.blogRepository.find({
      where: { category, isPublished: true, isActive: true },
      order: { publishedAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Search blogs by heading or tagline
   */
  async searchBlogs(searchTerm: string): Promise<Blog[]> {
    return this.blogRepository
      .createQueryBuilder('blog')
      .where('blog.heading ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('blog.tagline ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .andWhere('blog.isPublished = :isPublished', { isPublished: true })
      .andWhere('blog.isActive = :isActive', { isActive: true })
      .orderBy('blog.publishedAt', 'DESC')
      .getMany();
  }

  /**
   * Get featured blogs (for homepage)
   */
  async getFeaturedBlogs(limit: number = 5): Promise<Blog[]> {
    return this.blogRepository.find({
      where: { isPublished: true, isActive: true },
      order: { viewCount: 'DESC', publishedAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get recent blogs
   */
  async getRecentBlogs(limit: number = 10): Promise<Blog[]> {
    return this.getPublishedBlogs(limit);
  }
}
