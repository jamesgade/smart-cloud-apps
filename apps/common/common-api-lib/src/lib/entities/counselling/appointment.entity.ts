import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Student } from '../auth/student/student.entity';
import { User } from '../auth/user.entity';
import { AppointmentStatus } from './appointment-status.entity';

@Entity({ name: 'appointments', schema: 'counselling' })
export class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'appointment_id' })
  appointmentId: string;

  @Column({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @Column({ name: 'counsellor_id', type: 'uuid' })
  counsellorId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'appointment_date', type: 'date' })
  appointmentDate: string;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'status_id', type: 'uuid' })
  statusId: string;

  @Column({ name: 'student_notes', type: 'text', nullable: true })
  studentNotes: string;

  @Column({ name: 'counsellor_notes', type: 'text', nullable: true })
  counsellorNotes: string;

  @Column({ name: 'confirmed_at', type: 'timestamp', nullable: true })
  confirmedAt: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ name: 'cancelled_by', type: 'uuid', nullable: true })
  cancelledBy: string;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
  cancellationReason: string;

  // Relations
  @ManyToOne(() => Student, { eager: false })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'counsellor_id' })
  counsellor: User;

  @ManyToOne(() => AppointmentStatus, { eager: false })
  @JoinColumn({ name: 'status_id' })
  status: AppointmentStatus;
}

