import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from '../auth/user.entity';

@Index('blogs_pkey', ['blogId'], { unique: true })
@Index('idx_blogs_slug', ['slug'], { unique: true })
@Entity({ schema: 'common', name: 'blogs' })
export class Blog extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'blog_id',
    default: () => 'uuid_generate_v4()',
  })
  blogId: string;

  @Column({ type: 'varchar', length: 500, name: 'heading' })
  heading: string;

  @Column({ type: 'varchar', length: 1000, nullable: true, name: 'tagline' })
  tagline: string;

  @Column({ type: 'varchar', length: 500, unique: true, name: 'slug' })
  slug: string;

  @Column({ type: 'text', nullable: true, name: 'section_1' })
  section1: string;

  @Column({ type: 'text', nullable: true, name: 'section_2' })
  section2: string;

  @Column({ type: 'text', nullable: true, name: 'section_3' })
  section3: string;

  @Column({ type: 'text', nullable: true, name: 'author_signature' })
  authorSignature: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'author_name' })
  authorName: string;

  @Column({ type: 'uuid', nullable: true, name: 'author_id' })
  authorId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ type: 'boolean', default: false, name: 'is_published' })
  isPublished: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'published_at' })
  publishedAt: Date;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'category' })
  category: string;

  @Column({ type: 'text', nullable: true, name: 'tags' })
  tags: string;

  @Column({ type: 'integer', default: 0, name: 'view_count' })
  viewCount: number;

  @Column({ type: 'text', nullable: true, name: 'meta_description' })
  metaDescription: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;
}
