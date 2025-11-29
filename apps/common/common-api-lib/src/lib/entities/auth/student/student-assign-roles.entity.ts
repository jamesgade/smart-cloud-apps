import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { Student } from './student.entity';
import { Roles } from '../roles.entity';

@Index('student_assign_roles_pkey', ['studentId', 'roleId'], { unique: true })
@Entity('student_assign_roles', { schema: 'student' })
export class StudentAssignRoles extends BaseEntity {
  @Column('uuid', { name: 'student_id', primary: true })
  studentId: string;

  @Column('uuid', { name: 'role_id', primary: true })
  roleId: string;

  @ManyToOne(() => Student, (student) => student.studentAssignRoles, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'studentId' }])
  student: Student;

  @OneToOne(() => Roles, (roles) => roles.studentAssignRoles)
  roles: Roles;
}
