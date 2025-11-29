import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Student } from './student.entity';
import { Course } from './course.entity';
import { BaseEntity } from '../../base.entity';

@Index('student_assign_course_pkey', ['studentId','courseId'], { unique: true })
@Entity({ schema: 'student', name: 'student_assign_course' })
export class StudentAssignCourse extends BaseEntity {
  @Column('uuid', { name: 'student_id', primary: true })
  studentId: string;

  @Column('uuid', { name: 'course_id', primary: true })
  courseId: string;

  @ManyToOne(() => Student, (student) => student.studentAssignCourse, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'studentId' }])
  student: Student;

    @OneToOne(() => Course, (course) => course.studentAssignCourse)
    course: Course;
}
