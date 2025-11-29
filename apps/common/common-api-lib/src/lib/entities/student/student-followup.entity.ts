import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Index('student_followup_pkey', ['followupId'], { unique: true })
@Entity({ schema: 'student', name: 'student_followup' })
export class StudentFollowup extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'followup_id',
    default: () => 'uuid_generate_v4()',
  })
  followupId: string;

  @Column('uuid', { name: 'student_id' })
  studentId: string;

  @Column({ type: 'varchar', length: 50, name: 'followup_type' })
  followupType: 'HOT' | 'COLD' | 'WARM' | 'FOLLOWUP' | 'CLOSED';

  @Column({ type: 'timestamp', name: 'followup_date' })
  followupDate: Date;

  @Column({ type: 'text', nullable: true, name: 'notes' })
  notes: string;

  @Column('uuid', { name: 'counsellor_id', nullable: true })
  counsellorId: string;

  @Column({ type: 'timestamp', name: 'next_followup_date', nullable: true })
  nextFollowupDate: Date;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'SCHEDULED',
    name: 'status'
  })
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
}

