import { Column, Entity, Index } from 'typeorm';

@Index('chat_question_pkey', ['questionId'], { unique: true })
@Entity('chat_question', { schema: 'chat' })
export class ChatQuestion {
  @Column('uuid', {
    primary: true,
    name: 'question_id',
    default: () => 'uuid_generate_v4()',
  })
  questionId!: string;

  @Column('character varying', { name: 'code', length: 100, unique: true })
  code!: string;

  @Column('character varying', { name: 'text', length: 1000 })
  text!: string;

  @Column('character varying', { name: 'question_type', length: 50, default: () => "'text'" })
  questionType!: string;

  @Column('jsonb', { name: 'options_json', nullable: true })
  optionsJson!: Record<string, unknown> | null;

  @Column('integer', { name: 'order_by', default: () => '0' })
  orderBy!: number;

  @Column('boolean', { name: 'active', default: () => 'true' })
  active!: boolean;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column('timestamp without time zone', {
    name: 'updated_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}


