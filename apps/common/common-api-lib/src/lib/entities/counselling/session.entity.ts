import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Appointment } from './appointment.entity';
import { SessionStatus } from './session-status.entity';

@Entity({ name: 'sessions', schema: 'counselling' })
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'session_id' })
  sessionId: string;

  @Column({ name: 'appointment_id', type: 'uuid' })
  appointmentId: string;

  @Column({ name: 'launched_at', type: 'timestamp', nullable: true })
  launchedAt: Date;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamp', nullable: true })
  endedAt: Date;

  @Column({ name: 'duration_minutes', type: 'integer', nullable: true })
  durationMinutes: number;

  @Column({ name: 'status_id', type: 'uuid' })
  statusId: string;

  @Column({ name: 'counsellor_joined', type: 'boolean', default: false })
  counsellorJoined: boolean;

  @Column({ name: 'counsellor_joined_at', type: 'timestamp', nullable: true })
  counsellorJoinedAt: Date;

  @Column({ name: 'student_joined', type: 'boolean', default: false })
  studentJoined: boolean;

  @Column({ name: 'student_joined_at', type: 'timestamp', nullable: true })
  studentJoinedAt: Date;

  @Column({ name: 'session_notes', type: 'text', nullable: true })
  sessionNotes: string;

  // Relations
  @ManyToOne(() => Appointment, { eager: false })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @ManyToOne(() => SessionStatus, { eager: false })
  @JoinColumn({ name: 'status_id' })
  status: SessionStatus;
}

