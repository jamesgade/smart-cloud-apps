import { Column, Entity, Index } from 'typeorm';

@Index('user_history_pkey', ['userLoginHistoryId'], { unique: true })
@Entity('user_login_history', { schema: 'auth' })
export class UserLoginHistory {
  @Column('uuid', { primary: true, name: 'user_login_history_id' })
  userLoginHistoryId: string;

  @Column('uuid', { name: 'user_id', nullable: true })
  userId: string | null;

  @Column('uuid', { name: 'student_id', nullable: true })
  student_id: string | null;

  @Column('character varying', { name: 'email', length: 500, nullable: true })
  email: string | null;

  @Column('character varying', {
    name: 'status',
    length: 100,
    nullable: false,
  })
  status: string;

  @Column('character varying', {
    name: 'app_name',
    length: 100,
    nullable: true,
  })
  appName: string | null;

  @Column('character varying', {
    name: 'ip_address',
    length: 100,
    nullable: true,
  })
  ipAddress: string | null;

  @Column('boolean', { name: 'is_mobile', default: false })
  isMobile: boolean;

  @Column('text', { name: 'log', nullable: true })
  log: string | null;

  @Column('text', { name: 'user_browser_info', nullable: true })
  userBrowserInfo: string | null;
}
