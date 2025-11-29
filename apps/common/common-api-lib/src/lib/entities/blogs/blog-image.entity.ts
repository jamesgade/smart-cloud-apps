import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Blog } from './blog.entity';

@Index('blog_images_pkey', ['imageId'], { unique: true })
@Entity({ schema: 'common', name: 'blog_images' })
export class BlogImage extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'image_id',
    default: () => 'uuid_generate_v4()',
  })
  imageId: string;

  @Column('uuid', { name: 'blog_id' })
  blogId: string;

  @ManyToOne(() => Blog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @Column({ type: 'varchar', length: 1000, name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'alt_text' })
  altText: string;

  @Column({ type: 'text', nullable: true, name: 'caption' })
  caption: string;

  @Column({ type: 'int', default: 1, name: 'image_order' })
  imageOrder: number;

  @Column({ type: 'boolean', default: false, name: 'is_featured' })
  isFeatured: boolean;
}