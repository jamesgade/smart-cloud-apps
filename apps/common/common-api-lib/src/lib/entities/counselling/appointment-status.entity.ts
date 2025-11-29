import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'appointment_status', schema: 'counselling' })
export class AppointmentStatus extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'status_id' })
  statusId: string;

  @Column({ name: 'status_code', length: 50, unique: true })
  statusCode: string;

  @Column({ name: 'status_name', length: 100 })
  statusName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'display_order', type: 'integer' })
  displayOrder: number;
}

