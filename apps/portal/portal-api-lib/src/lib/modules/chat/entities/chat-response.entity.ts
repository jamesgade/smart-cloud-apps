import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ChatQuestion } from './chat-question.entity';

@Index('chat_response_pkey', ['responseId'], { unique: true })
@Entity('chat_response', { schema: 'chat' })
export class ChatResponse {
  @Column('uuid', {
    primary: true,
    name: 'response_id',
    default: () => 'uuid_generate_v4()',
  })
  responseId!: string;

  @Column('uuid', { name: 'session_id' })
  sessionId!: string;

  @Column('uuid', { name: 'question_id' })
  questionId!: string;

  @ManyToOne(() => ChatQuestion, { eager: true })
  @JoinColumn({ name: 'question_id' })
  question!: ChatQuestion;

  @Column('text', { name: 'answer_text', nullable: true })
  answerText!: string | null;

  @Column('character varying', { name: 'answer_value', nullable: true, length: 255 })
  answerValue!: string | null;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}


