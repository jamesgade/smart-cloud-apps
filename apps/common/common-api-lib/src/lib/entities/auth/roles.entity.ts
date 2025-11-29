import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserAssignRoles } from './user-assign-roles.entity';
import { StudentAssignRoles } from './student/student-assign-roles.entity';

@Index('role_pkey', ['id'], { unique: true })
@Entity('roles', { schema: 'auth' })
export class Roles {
  @Column('uuid', {
    primary: true,
    name: 'role_id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'name', length: 500 })
  title: string;

  @Column('character varying', {
    name: 'description',
    nullable: true,
    length: 250,
    default: () => 'NULL::character varying',
  })
  description: string | null;

  @Column('integer', { name: 'order_by' })
  orderBy: number;

  @Column('uuid', { name: 'user_type_id' })
  userTypeId: string;

  @OneToMany(() => UserAssignRoles, (userAssignRoles) => userAssignRoles.role, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  userAssignRoles: UserAssignRoles[];

  @OneToOne(
    () => StudentAssignRoles,
    (studentAssignRoles) => studentAssignRoles.roles,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    }
  )
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'roleId' }])
  studentAssignRoles: StudentAssignRoles;
}
