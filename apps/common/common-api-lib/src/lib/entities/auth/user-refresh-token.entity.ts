import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

@Index('user_refresh_token_pkey', ['userId'], { unique: true })
@Entity('user_refresh_token', { schema: 'auth' })
export class UserRefreshToken {
  @Column('uuid', { primary: true, name: 'user_id' })
  userId: string;

  @Column('text', { name: 'refreshtoken', nullable: false })
  refreshtoken: string;

  @Column('text', { name: 'session_identifier', nullable: false })
  sessionIdentifier: string;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp without time zone', {
    name: 'updated_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
