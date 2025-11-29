import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { College } from './college.entity';
import { Student } from '../auth/student/student.entity';
import { User } from '../auth/user.entity';

@Index('student_assigned_colleges_pkey', ['assignmentId'], { unique: true })
@Index('uq_student_college_active', ['studentId', 'collegeId', 'assignmentStatus'], { unique: true })
@Entity({ schema: 'common', name: 'student_assigned_colleges' })
export class StudentAssignedCollege extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'assignment_id',
    default: () => 'uuid_generate_v4()',
  })
  assignmentId: string;

  @Column('uuid', { name: 'student_id' })
  studentId: string;

  @Column('uuid', { name: 'college_id' })
  collegeId: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'INTERESTED',
    name: 'assignment_type'
  })
  assignmentType: 'INTERESTED' | 'APPLIED' | 'ADMITTED' | 'ENROLLED' | 'REJECTED' | 'WAITLISTED';

  @Column({
    type: 'varchar',
    length: 50,
    default: 'ACTIVE',
    name: 'assignment_status'
  })
  assignmentStatus: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED';

  @Column({ type: 'integer', nullable: true, name: 'priority_order' })
  priorityOrder: number;

  @Column({ type: 'date', nullable: true, name: 'application_date' })
  applicationDate: Date;

  @Column({ type: 'date', nullable: true, name: 'admission_date' })
  admissionDate: Date;

  @Column({ type: 'date', nullable: true, name: 'enrollment_date' })
  enrollmentDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'course_name' })
  courseName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  specialization: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  semester: string;

  @Column({ type: 'text', nullable: true, name: 'student_notes' })
  studentNotes: string;

  @Column({ type: 'text', nullable: true, name: 'counsellor_notes' })
  counsellorNotes: string;

  @Column('uuid', { nullable: true, name: 'assigned_by' })
  assignedBy: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'assigned_date'
  })
  assignedDate: Date;

  // Relations
  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'studentId' }])
  student: Student;

  @ManyToOne(() => College, (college) => college.studentAssignedColleges, { 
    onDelete: 'CASCADE' 
  })
  @JoinColumn([{ name: 'college_id', referencedColumnName: 'collegeId' }])
  college: College;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn([{ name: 'assigned_by', referencedColumnName: 'userId' }])
  assignedByUser: User;
}