import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Index('exams_pkey', ['examId'], { unique: true })
@Entity({ schema: 'common', name: 'exams' })
export class Exam extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'exam_id',
    default: () => 'uuid_generate_v4()',
  })
  examId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  category: string; // Engineering, Medical, Management, Law, etc.

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date', nullable: true, name: 'exam_date' })
  examDate?: Date;

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  startDate?: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate?: Date;

  @Column({ type: 'varchar', length: 50, default: 'UPCOMING' })
  status: 'UPCOMING' | 'CURRENT' | 'COMPLETED';

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  // Additional fields
  @Column({ type: 'date', nullable: true, name: 'application_start_date' })
  applicationStartDate?: Date;

  @Column({ type: 'date', nullable: true, name: 'application_end_date' })
  applicationEndDate?: Date;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'registration_url' })
  registrationUrl?: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'official_website' })
  officialWebsite?: string;

  @Column({ type: 'text', nullable: true })
  eligibility?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'exam_mode', default: 'ONLINE' })
  examMode?: string; // ONLINE | OFFLINE | HYBRID

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'exam_level', default: 'NATIONAL' })
  examLevel?: string; // NATIONAL | STATE | INSTITUTE

  @Column({ type: 'text', array: true, nullable: true })
  subjects?: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'application_fee' })
  applicationFee?: number;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'conducting_body' })
  conductingBody?: string;
}


