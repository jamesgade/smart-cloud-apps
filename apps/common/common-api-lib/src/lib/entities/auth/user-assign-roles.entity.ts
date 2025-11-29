import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Roles } from './roles.entity';
import { BaseEntity } from '../base.entity';

@Index('user_assign_roles_pkey', ['userId', 'roleId'], { unique: true })
@Entity('user_assign_roles', { schema: 'auth' })
export class UserAssignRoles extends BaseEntity {
  @Column('uuid', { name: 'user_id', primary: true })
  userId: string;

  @Column('uuid', { name: 'role_id', primary: true })
  roleId: string;

  @ManyToOne(() => User, (user) => user.userAssignRoles, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: User;

  @ManyToOne(() => Roles, (roles) => roles.userAssignRoles)
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: Roles;
}
