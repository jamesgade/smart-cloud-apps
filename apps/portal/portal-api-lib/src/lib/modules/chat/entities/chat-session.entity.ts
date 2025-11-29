import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ChatResponse } from './chat-response.entity';

@Index('chat_session_pkey', ['sessionId'], { unique: true })
@Entity('chat_session', { schema: 'chat' })
export class ChatSession {
  @Column('uuid', {
    primary: true,
    name: 'session_id',
    default: () => 'uuid_generate_v4()',
  })
  sessionId!: string;

  @Column('character varying', { name: 'mobile', length: 20 })
  mobile!: string;

  @Column('character varying', { name: 'status', length: 20, default: () => "'active'" })
  status!: string;

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

  @OneToMany(() => ChatResponse, response => response.sessionId)
  responses!: ChatResponse[];
}


