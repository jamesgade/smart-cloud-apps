import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Index('user_otp_pkey', ['userId'], { unique: true })
@Entity('user_otp', { schema: 'auth' })
export class UserOtp extends BaseEntity {
  @Column('uuid', { primary: true, name: 'user_id' })
  userId: string;

  @Column('character varying', {
    name: 'current_otp',
    nullable: false,
    length: 6,
  })
  currentOtp: string;

  @Column('int', {
    name: 'expiry_epoch',
    nullable: false,
  })
  expiryEpoch: number;

  @Column('int', {
    name: 'otp_attempts',
    nullable: false,
  })
  otpAttempts: number;

  @Column('character varying', { name: 'captcha', nullable: true, length: 4 })
  captcha: string | null;
}
