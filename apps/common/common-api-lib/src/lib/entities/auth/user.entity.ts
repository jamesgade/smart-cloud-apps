import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserType } from './user-type.entity';
import { BaseEntity } from '../base.entity';
import { UserAssignRoles } from './user-assign-roles.entity';

@Index('user_pkey', ['userId'], { unique: true })
@Entity('user', { schema: 'auth' })
export class User extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'user_id',
    default: () => 'uuid_generate_v4()',
  })
  userId: string;

  @Column('character varying', { name: 'email', length: 500 })
  email: string;

  @Column('character varying', { name: 'first_name', length: 50 })
  firstName: string;

  @Column('character varying', { name: 'last_name', length: 50 })
  lastName: string;

  @Column('character varying', { name: 'middle_initial', length: 150 })
  middleInitial: string;

  @Column('uuid', { name: 'user_type_id', nullable: true })
  userTypeId: string;


  @Column('boolean', { name: 'is_mobile_mfa', default: false })
  isMobileMfa: boolean;


    @Column('boolean', { name: 'is_mfa', default: false })
  isMfa: boolean;

  @Column('boolean', { name: 'is_mobile_validate', default: false })
  isMobileValidate: boolean;

  @Column('text', { name: 'signature', default: false })
  signature: string | null;

  @Column('character varying', { name: 'password', nullable: true })
  password: string | null;

  @Column('character varying', {
    name: 'status',
    length: 150,
  })
  status: string;


  @OneToMany(() => UserAssignRoles, (userAssignRoles) => userAssignRoles.user, {
    cascade: true
  })
  userAssignRoles!: UserAssignRoles[];

  @ManyToOne(() => UserType, (userType) => userType.users)
  @JoinColumn([{ name: 'user_type_id', referencedColumnName: 'userTypeId' }])
  userType!: UserType;
}
