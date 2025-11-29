import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog, BlogImage, CommonApiLibModule } from '@smart-cloud-apps/common-api-lib';
import { BlogService } from './blog.service';
import { BlogImageService } from './blog-image.service';
import { BlogController, BlogAdminController } from './blog.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, BlogImage]),
    CommonApiLibModule
  ],
  controllers: [BlogController, BlogAdminController],
  providers: [BlogService, BlogImageService],
  exports: [BlogService, BlogImageService],
})
export class BlogModule {}
