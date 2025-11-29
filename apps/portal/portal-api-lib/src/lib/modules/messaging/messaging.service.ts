import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Conversation, Message, ConversationParticipant } from '@smart-cloud-apps/common-api-lib';

export interface CreateConversationDto {
  subject: string;
  messageText: string;
}

export interface CreateMessageDto {
  conversationId: string;
  messageText: string;
  messageType?: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
}

export interface ConversationWithDetails extends Conversation {
  counsellorName?: string;
  studentName?: string;
  unreadCount?: number;
  lastMessage?: Message;
}

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(ConversationParticipant)
    private participantRepository: Repository<ConversationParticipant>,
  ) {}

  async createConversation(
    createConversationDto: CreateConversationDto,
    studentId: string,
    createdBy: string,
  ): Promise<ConversationWithDetails> {
    // Create conversation
    const conversation = this.conversationRepository.create({
      studentId,
      subject: createConversationDto.subject,
      status: 'OPEN',
      priority: 'NORMAL',
      createdBy,
      updatedBy: createdBy,
    });

    const savedConversation = await this.conversationRepository.save(conversation);

    // Create initial message
    const message = this.messageRepository.create({
      conversationId: savedConversation.conversationId,
      senderId: studentId,
      senderType: 'STUDENT',
      messageText: createConversationDto.messageText,
      messageType: 'TEXT',
      createdBy,
      updatedBy: createdBy,
    });

    await this.messageRepository.save(message);

    // Return conversation with details
    return this.getConversationWithDetails(savedConversation.conversationId);
  }

  async getStudentConversations(studentId: string): Promise<ConversationWithDetails[]> {
    const conversations = await this.conversationRepository.find({
      where: { studentId },
      order: { updatedAt: 'DESC' },
    });

    const conversationsWithDetails = await Promise.all(
      conversations.map(conv => this.getConversationWithDetails(conv.conversationId))
    );

    return conversationsWithDetails;
  }

  async getConversationWithDetails(conversationId: string, userType?: string): Promise<ConversationWithDetails> {
    const conversation = await this.conversationRepository.findOne({
      where: { conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Get unread count based on user type
    let unreadCount = 0;
    if (userType === 'Admin') {
      // For admins, count unread messages from students and counsellors
      unreadCount = await this.messageRepository.count({
        where: {
          conversationId,
          senderType: In(['STUDENT', 'COUNSELLOR']),
          isRead: false,
        },
      });
    } else if (userType === 'Counsellor') {
      // For counsellors, count unread messages from students
      unreadCount = await this.messageRepository.count({
        where: {
          conversationId,
          senderType: 'STUDENT',
          isRead: false,
        },
      });
    } else {
      // For students, count unread messages from counsellors and admins
      unreadCount = await this.messageRepository.count({
        where: {
          conversationId,
          senderType: In(['COUNSELLOR', 'ADMIN']),
          isRead: false,
        },
      });
    }

    // Get last message
    const lastMessage = await this.messageRepository.findOne({
      where: { conversationId },
      order: { createdAt: 'DESC' },
    });

    // Get student name
    let studentName = 'Unknown';
    try {
      const studentQuery = await this.conversationRepository.query(`
        SELECT s.first_name, s.last_name 
        FROM student.student s 
        WHERE s.student_id = $1
      `, [conversation.studentId]);
      
      if (studentQuery && studentQuery.length > 0) {
        const student = studentQuery[0];
        studentName = `${student.first_name} ${student.last_name}`.trim();
      }
    } catch (error) {
      console.log('Error fetching student name:', error);
    }

    // Get counsellor name from the last counsellor message
    let counsellorName = 'Unassigned';
    try {
      const lastCounsellorMessage = await this.messageRepository.findOne({
        where: { 
          conversationId,
          senderType: 'COUNSELLOR'
        },
        order: { createdAt: 'DESC' },
      });
      
      if (lastCounsellorMessage) {
        const counsellorQuery = await this.conversationRepository.query(`
          SELECT u.first_name, u.last_name 
          FROM auth."user" u 
          WHERE u.user_id = $1
        `, [lastCounsellorMessage.senderId]);
        
        if (counsellorQuery && counsellorQuery.length > 0) {
          const counsellor = counsellorQuery[0];
          counsellorName = `${counsellor.first_name} ${counsellor.last_name}`.trim();
        }
      }
    } catch (error) {
      console.log('Error fetching counsellor name:', error);
    }

    return {
      ...conversation,
      unreadCount,
      lastMessage,
      studentName,
      counsellorName,
    } as ConversationWithDetails;
  }

  async getConversationMessages(conversationId: string, userId: string, userType?: string): Promise<any[]> {
    // Check if user has access to this conversation (skip check for admins)
    if (userType !== 'ADMIN') {
      const participant = await this.participantRepository.findOne({
        where: {
          conversationId,
          userId,
        },
      });

      if (!participant) {
        throw new ForbiddenException('You do not have access to this conversation');
      }
    }

    const messages = await this.messageRepository.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });

    // Mark messages as read for the requesting user (skip for admins)
    if (userType !== 'ADMIN') {
      await this.markMessagesAsRead(conversationId, userId);
    }

    // Add sender names to messages
    const messagesWithNames = await Promise.all(
      messages.map(async (message) => {
        let senderName = 'Unknown';
        
        try {
          if (message.senderType === 'STUDENT') {
            const studentQuery = await this.conversationRepository.query(`
              SELECT s.first_name, s.last_name 
              FROM student.student s 
              WHERE s.student_id = $1
            `, [message.senderId]);
            
            if (studentQuery && studentQuery.length > 0) {
              const student = studentQuery[0];
              senderName = `${student.first_name} ${student.last_name}`.trim();
            }
          } else if (message.senderType === 'COUNSELLOR' || message.senderType === 'ADMIN') {
            const userQuery = await this.conversationRepository.query(`
              SELECT u.first_name, u.last_name 
              FROM auth."user" u 
              WHERE u.user_id = $1
            `, [message.senderId]);
            
            if (userQuery && userQuery.length > 0) {
              const user = userQuery[0];
              senderName = `${user.first_name} ${user.last_name}`.trim();
            }
          }
        } catch (error) {
          console.log('Error fetching sender name:', error);
        }

        return {
          ...message,
          senderName,
        };
      })
    );

    return messagesWithNames;
  }

  async createMessage(
    createMessageDto: CreateMessageDto,
    senderId: string,
    senderType: 'STUDENT' | 'COUNSELLOR' | 'ADMIN',
    createdBy: string,
  ): Promise<Message> {
    // Verify conversation exists and user has access (skip check for admins)
    if (senderType !== 'ADMIN') {
      const participant = await this.participantRepository.findOne({
        where: {
          conversationId: createMessageDto.conversationId,
          userId: senderId,
        },
      });

      if (!participant) {
        throw new ForbiddenException('You do not have access to this conversation');
      }
    }

    const message = this.messageRepository.create({
      conversationId: createMessageDto.conversationId,
      senderId,
      senderType,
      messageText: createMessageDto.messageText,
      messageType: createMessageDto.messageType || 'TEXT',
      createdBy,
      updatedBy: createdBy,
    });

    const savedMessage = await this.messageRepository.save(message);

    // Update conversation timestamp only
    await this.conversationRepository.update(
      { conversationId: createMessageDto.conversationId },
      { updatedAt: new Date(), updatedBy: createdBy }
    );

    return savedMessage;
  }

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    await this.messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where('conversationId = :conversationId', { conversationId })
      .andWhere('senderId != :userId', { userId })
      .andWhere('isRead = :isRead', { isRead: false })
      .execute();
  }

  async assignConversation(
    conversationId: string,
    counsellorId: string,
    updatedBy: string,
  ): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.status !== 'OPEN') {
      throw new ForbiddenException('Conversation is not available for assignment');
    }

    // Update conversation
    conversation.counsellorId = counsellorId;
    conversation.status = 'ASSIGNED';
    conversation.updatedBy = updatedBy;
    conversation.updatedAt = new Date();

    const updatedConversation = await this.conversationRepository.save(conversation);

    // Update participant role
    await this.participantRepository.update(
      {
        conversationId,
        userId: counsellorId,
        userType: 'COUNSELLOR',
      },
      {
        role: 'PARTICIPANT',
        updatedBy,
        updatedAt: new Date(),
      },
    );

    return updatedConversation;
  }

  async closeConversation(
    conversationId: string,
    userId: string,
    updatedBy: string,
  ): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if user has permission to close (counsellor or admin)
    const participant = await this.participantRepository.findOne({
      where: {
        conversationId,
        userId,
        role: 'PARTICIPANT',
      },
    });

    if (!participant || !['COUNSELLOR', 'ADMIN'].includes(participant.userType)) {
      throw new ForbiddenException('You do not have permission to close this conversation');
    }

    conversation.status = 'CLOSED';
    conversation.updatedBy = updatedBy;
    conversation.updatedAt = new Date();

    return await this.conversationRepository.save(conversation);
  }

  async getAllConversationsForCounsellors(): Promise<ConversationWithDetails[]> {
    const conversations = await this.conversationRepository.find({
      where: { status: 'OPEN' },
      order: { createdAt: 'DESC' },
    });

    const conversationsWithDetails = await Promise.all(
      conversations.map(conv => this.getConversationWithDetails(conv.conversationId, 'Counsellor'))
    );

    return conversationsWithDetails;
  }

  async getAllConversationsForAdmins(): Promise<ConversationWithDetails[]> {
    const conversations = await this.conversationRepository.find({
      order: { updatedAt: 'DESC' },
    });

    const conversationsWithDetails = await Promise.all(
      conversations.map(conv => this.getConversationWithDetails(conv.conversationId, 'Admin'))
    );

    return conversationsWithDetails;
  }
}
