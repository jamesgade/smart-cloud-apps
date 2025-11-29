import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Index('scholarships_pkey', ['scholarshipId'], { unique: true })
@Entity({ schema: 'common', name: 'scholarships' })
export class Scholarship extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'scholarship_id',
    default: () => 'uuid_generate_v4()',
  })
  scholarshipId: string;

  @Column({ type: 'varchar', length: 255, name: 'scholarship_name' })
  scholarshipName: string;

  @Column({ type: 'varchar', length: 255, name: 'provider' })
  provider: string;

  @Column({ type: 'text', nullable: true, name: 'eligibility_criteria' })
  eligibilityCriteria: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'applicable_courses' })
  applicableCourses: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'education_level' })
  educationLevel: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'scholarship_amount' })
  scholarshipAmount: number;

  @Column({ type: 'text', nullable: true, name: 'benefits_description' })
  benefitsDescription: string;

  @Column({ type: 'text', nullable: true, name: 'application_process' })
  applicationProcess: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'portal_link' })
  portalLink: string;

  @Column({ type: 'date', nullable: true, name: 'application_start_date' })
  applicationStartDate: Date;

  @Column({ type: 'date', nullable: true, name: 'application_end_date' })
  applicationEndDate: Date;

  @Column({ type: 'text', nullable: true, name: 'renewal_schedule' })
  renewalSchedule: string;

  @Column({ type: 'text', nullable: true, name: 'overall_remarks' })
  overallRemarks: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;
}
