import {
  Entity,
  Column,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Index('student_otp_pkey', ['studentOtpId'], { unique: true })
@Entity({ schema: 'auth', name: 'student_otp' })
export class StudentOtp extends BaseEntity {
  @Column('uuid', { primary: true, name: 'student_otp_id', default: () => 'uuid_generate_v4()' })
  studentOtpId: string;

  @Column('uuid', { name: 'student_id', nullable: true })
  studentId: string | null;

  @Column('varchar', { length: 10, name: 'mobile_phone' })
  mobilePhone: string;

  @Column({ type: 'varchar', length: 6, name: 'current_otp' })
  currentOtp: string;

  @Column({ type: 'int', name: 'expiry_epoch' })
  expiryEpoch: number;

  @Column({ type: 'int', nullable: true, name: 'otp_attempts' })
  otpAttempts: number;

  @Column({ type: 'varchar', length: 4, nullable: true, name: 'captcha' })
  captcha: string;
}
