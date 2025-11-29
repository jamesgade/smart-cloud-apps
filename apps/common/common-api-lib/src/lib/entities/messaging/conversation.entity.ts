import { Entity, Column, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Index('conversations_pkey', ['conversationId'], { unique: true })
@Entity({ schema: 'messaging', name: 'conversations' })
export class Conversation extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'conversation_id',
    default: () => 'uuid_generate_v4()',
  })
  conversationId: string;

  @Column('uuid', { name: 'student_id' })
  studentId: string;

  @Column('uuid', { name: 'counsellor_id', nullable: true })
  counsellorId?: string;

  @Column({ type: 'varchar', length: 255, name: 'subject' })
  subject: string;

  @Column({ type: 'varchar', length: 20, default: 'OPEN', name: 'status' })
  status: 'OPEN' | 'ASSIGNED' | 'CLOSED';

  @Column({ type: 'varchar', length: 10, default: 'NORMAL', name: 'priority' })
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

  // Relations
  @OneToMany(() => Message, message => message.conversation)
  messages: Message[];

  @OneToMany(() => ConversationParticipant, participant => participant.conversation)
  participants: ConversationParticipant[];
}

@Index('messages_pkey', ['messageId'], { unique: true })
@Entity({ schema: 'messaging', name: 'messages' })
export class Message extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'message_id',
    default: () => 'uuid_generate_v4()',
  })
  messageId: string;

  @Column('uuid', { name: 'conversation_id' })
  conversationId: string;

  @Column('uuid', { name: 'sender_id' })
  senderId: string;

  @Column({ type: 'varchar', length: 20, name: 'sender_type' })
  senderType: 'STUDENT' | 'COUNSELLOR' | 'ADMIN';

  @Column({ type: 'text', name: 'message_text' })
  messageText: string;

  @Column({ type: 'varchar', length: 20, default: 'TEXT', name: 'message_type' })
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';

  @Column({ type: 'boolean', default: false, name: 'is_read' })
  isRead: boolean;

  @Column({ type: 'timestamp', name: 'read_at', nullable: true })
  readAt?: Date;

  // Relations
  @ManyToOne(() => Conversation, conversation => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;
}

@Index('conversation_participants_pkey', ['participantId'], { unique: true })
@Entity({ schema: 'messaging', name: 'conversation_participants' })
export class ConversationParticipant extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'participant_id',
    default: () => 'uuid_generate_v4()',
  })
  participantId: string;

  @Column('uuid', { name: 'conversation_id' })
  conversationId: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 20, name: 'user_type' })
  userType: 'STUDENT' | 'COUNSELLOR' | 'ADMIN';

  @Column({ type: 'varchar', length: 20, name: 'role' })
  role: 'PARTICIPANT' | 'OBSERVER';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'joined_at' })
  joinedAt: Date;

  // Relations
  @ManyToOne(() => Conversation, conversation => conversation.participants)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;
}
