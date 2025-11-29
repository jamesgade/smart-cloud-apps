import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { StudentAssignCourse } from './student-assign-course.entity';
import { StudentAssignRoles } from './student-assign-roles.entity';

@Index('student_pkey', ['studentId'], { unique: true })
@Entity({ schema: 'student', name: 'student' })
export class Student extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'student_id',
    default: () => 'uuid_generate_v4()',
  })
  studentId: string;

  @Column({ type: 'varchar', length: 500, name: 'email' })
  email: string;

  @Column({ type: 'varchar', length: 50, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 50, name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'middle_initial' })
  middleInitial: string;

  @Column({ type: 'varchar', length: 10, name: 'mobile_phone' })
  mobilePhone: string;

  @Column({ type: 'text', nullable: true, name: 'signature' })
  signature: string;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'status' })
  status: 'ACTIVE' | 'IN-ACTIVE';

  @Column('uuid', { name: 'user_type_id', nullable: true })
  userTypeId: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'state' })
  state: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'city' })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'referral_source' })
  referralSource?: string;

  @OneToMany(
    () => StudentAssignCourse,
    (studentAssignCourse) => studentAssignCourse.student,
    { cascade: true }
  )
  studentAssignCourse: StudentAssignCourse[];

  @OneToMany(
    () => StudentAssignRoles,
    (studentAssignRoles) => studentAssignRoles.student,
    { cascade: true }
  )
  studentAssignRoles: StudentAssignRoles[];
}
