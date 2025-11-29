import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { StudentAssignCourse } from './student-assign-course.entity';

@Index('course_pkey', ['courseId'], { unique: true })
@Entity({ schema: 'student', name: 'course' })
export class Course extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'course_id',
    default: () => 'uuid_generate_v4()',
  })
  courseId: string;

  @Column({ type: 'varchar', length: 500 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @OneToOne(
    () => StudentAssignCourse,
    (studentAssignCourse) => studentAssignCourse.course,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    }
  )
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'courseId' }])
  studentAssignCourse: StudentAssignCourse;
}
