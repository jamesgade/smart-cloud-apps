import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { Student } from './student.entity';

@Index('student_academic_profile_pkey', ['studentId'], { unique: true })
@Entity({ schema: 'student', name: 'student_academic_profile' })
export class StudentAcademicProfile extends BaseEntity {
  @Column('uuid', { primary: true, name: 'student_id' })
  studentId: string;

  @OneToOne(() => Student)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'studentId' })
  student: Student;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true, name: 'tenth_marks_percent' })
  tenthMarksPercent?: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true, name: 'inter_first_year_percent' })
  interFirstYearPercent?: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true, name: 'inter_second_year_percent' })
  interSecondYearPercent?: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'inter_stream' })
  interStream?: string; // e.g., MPC, BIPC, CEC, MEC

  @Column({ type: 'text', array: true, nullable: true, name: 'competitive_exams' })
  competitiveExams?: string[];

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'father_name' })
  fatherName?: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'father_mobile' })
  fatherMobile?: string;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'father_occupation' })
  fatherOccupation?: string;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'mother_name' })
  motherName?: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'mother_mobile' })
  motherMobile?: string;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'mother_occupation' })
  motherOccupation?: string;
}


