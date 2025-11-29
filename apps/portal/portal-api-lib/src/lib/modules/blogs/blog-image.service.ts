import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogImage, S3Service } from '@smart-cloud-apps/common-api-lib';
import { ConfigService } from '@nestjs/config';

export interface UploadBlogImageDto {
  blogId: string;
  image: string; // base64 encoded image
  altText?: string;
  caption?: string;
  imageOrder?: number;
  isFeatured?: boolean;
}

export interface UploadBlogImageFileDto {
  blogId: string;
  altText?: string;
  caption?: string;
  imageOrder?: number;
  isFeatured?: boolean;
}

@Injectable()
export class BlogImageService {
  private readonly bucketName = 'campus-blog-images';

  constructor(
    @InjectRepository(BlogImage)
    private readonly blogImageRepository: Repository<BlogImage>,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService
  ) {}

  async uploadBlogImage(uploadDto: UploadBlogImageDto, userId?: string): Promise<BlogImage> {
    const { blogId, image, altText, caption, imageOrder, isFeatured } = uploadDto;

    // Generate unique key for S3
    const timestamp = Date.now();
    const key = `${blogId}/${imageOrder}-image.jpg`;

    // Upload to S3
    await this.s3Service.uploadToS3Bucket(
      key,
      image,
      'image/jpeg',
      this.bucketName
    );

    // Construct image URL
    const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    const imageUrl = `https://${this.bucketName}.s3.${region}.amazonaws.com/${key}`;

    // If this is featured, unmark other featured images for this blog
    if (isFeatured) {
      await this.blogImageRepository.update(
        { blogId },
        { isFeatured: false }
      );
    }

    // Create blog image record
    const blogImage = this.blogImageRepository.create({
      blogId,
      imageUrl,
      altText: altText || '',
      caption: caption || undefined,
      imageOrder: imageOrder || 1,
      isFeatured: isFeatured || false,
      createdBy: userId || 'system',
      updatedBy: userId || 'system',
    });

    return await this.blogImageRepository.save(blogImage);
  }

  async uploadBlogImageFile(
    file: any, 
    uploadDto: UploadBlogImageFileDto, 
    userId?: string
  ): Promise<BlogImage> {
    const { blogId, altText, caption, imageOrder, isFeatured } = uploadDto;

    // Convert file buffer to base64
    const base64Image = file.buffer.toString('base64');

    // Generate unique key for S3
    const timestamp = Date.now();
    const fileExtension = file.originalname.split('.').pop() || 'jpg';
    const key = `${blogId}/${imageOrder}-image.${fileExtension}`;

    // Upload to S3
    await this.s3Service.uploadToS3Bucket(
      key,
      base64Image,
      file.mimetype,
      this.bucketName
    );

    // Construct image URL
    const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    const imageUrl = `https://${this.bucketName}.s3.${region}.amazonaws.com/${key}`;

    // If this is featured, unmark other featured images for this blog
    if (isFeatured) {
      await this.blogImageRepository.update(
        { blogId },
        { isFeatured: false }
      );
    }

    // Create blog image record
    const blogImage = this.blogImageRepository.create({
      blogId,
      imageUrl,
      altText: altText || '',
      caption: caption || undefined,
      imageOrder: imageOrder || 1,
      isFeatured: isFeatured || false,
      createdBy: userId || 'system',
      updatedBy: userId || 'system',
    });

    return await this.blogImageRepository.save(blogImage);
  }

  async getBlogImages(blogId: string): Promise<BlogImage[]> {
    return await this.blogImageRepository.find({
      where: { blogId },
      order: { imageOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async deleteBlogImage(imageId: string): Promise<void> {
    const image = await this.blogImageRepository.findOne({
      where: { imageId },
    });

    if (image) {
      // Note: We're not deleting from S3 in this implementation
      // You may want to add S3 deletion if needed
      
      await this.blogImageRepository.remove(image);
    }
  }

  async updateBlogImage(
    imageId: string,
    updateData: Partial<Pick<BlogImage, 'altText' | 'caption' | 'imageOrder' | 'isFeatured'>>,
    userId?: string
  ): Promise<BlogImage | null> {
    const image = await this.blogImageRepository.findOne({
      where: { imageId },
    });

    if (!image) {
      return null;
    }

    // If setting as featured, unmark other featured images for this blog
    if (updateData.isFeatured) {
      await this.blogImageRepository
        .createQueryBuilder()
        .update(BlogImage)
        .set({ isFeatured: false })
        .where('blogId = :blogId AND imageId != :imageId', { 
          blogId: image.blogId, 
          imageId: imageId 
        })
        .execute();
    }

    Object.assign(image, updateData, {
      updatedBy: userId || 'system',
      updatedAt: new Date(),
    });

    return await this.blogImageRepository.save(image);
  }
}