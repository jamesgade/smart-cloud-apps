import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../base.entity';

@Index('user_type_pkey', ['userTypeId'], { unique: true })
@Entity('user_type', { schema: 'auth' })
export class UserType extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'user_type_id',
    default: () => 'uuid_generate_v4()',
  })
  userTypeId: string;

  @Column('character varying', { name: 'name', length: 50 })
  name: string;

  @OneToMany(() => User, (user) => user.userType)
  users: User[];
}
