import { Entity, Column, BeforeUpdate } from 'typeorm';

@Entity()
export class BaseEntity {
  @Column('character varying', {
    name: 'created_by',
    nullable: false,
  })
  createdBy: string | undefined;

  @Column('character varying', {
    name: 'updated_by',
    nullable: false,
  })
  updatedBy: string | undefined;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | undefined;

  @Column('timestamp without time zone', {
    name: 'updated_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | undefined;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
