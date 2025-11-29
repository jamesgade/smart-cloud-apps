import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Student } from '../auth/student/student.entity';
import { User } from '../auth/user.entity';

@Index('assigned_students_pkey', ['assignmentId'], { unique: true })
@Index('uq_student_active_assignment', ['studentId', 'assignmentStatus'], { unique: true })
@Entity({ schema: 'common', name: 'assigned_students' })
export class AssignedStudent extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'assignment_id',
    default: () => 'uuid_generate_v4()',
  })
  assignmentId: string;

  @Column('uuid', { name: 'student_id' })
  studentId: string;

  @Column('uuid', { name: 'assigned_to' })
  assignedTo: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'ACTIVE',
    name: 'assignment_status'
  })
  assignmentStatus: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'TRANSFERRED';

  @Column('uuid', { name: 'assigned_by' })
  assignedBy: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'assigned_date'
  })
  assignedDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relations
  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'studentId' }])
  student: Student;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'assigned_to', referencedColumnName: 'userId' }])
  assignedToUser: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn([{ name: 'assigned_by', referencedColumnName: 'userId' }])
  assignedByUser: User;
}

