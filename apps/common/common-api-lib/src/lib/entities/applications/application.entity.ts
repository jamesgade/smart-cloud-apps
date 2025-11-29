import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Index('applications_pkey', ['applicationId'], { unique: true })
@Entity({ schema: 'applications', name: 'applications' })
export class Application extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'application_id',
    default: () => 'uuid_generate_v4()',
  })
  applicationId: string;

  @Column('uuid', { name: 'student_id' })
  studentId: string;

  @Column({ type: 'varchar', length: 255, name: 'student_name' })
  studentName: string;

  @Column({ type: 'varchar', length: 50, name: 'application_type' })
  applicationType: 'LOAN' | 'SCHOLARSHIP' | 'COLLEGE';

  @Column({ type: 'varchar', length: 255, name: 'application_title' })
  applicationTitle: string;

  @Column({ type: 'text', nullable: true, name: 'application_details' })
  applicationDetails: string;

  @Column({ 
    type: 'varchar', 
    length: 50, 
    default: 'PENDING',
    name: 'status'
  })
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';

  @Column({ 
    type: 'timestamp', 
    name: 'applied_date',
    default: () => 'CURRENT_TIMESTAMP' 
  })
  appliedDate: Date;

  @Column('uuid', { name: 'reviewed_by', nullable: true })
  reviewedBy: string;

  @Column({ 
    type: 'timestamp', 
    name: 'reviewed_date',
    nullable: true 
  })
  reviewedDate: Date;

  @Column({ type: 'text', nullable: true, name: 'review_notes' })
  reviewNotes: string;
}
