import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatQuestion, ChatSession, ChatResponse } from './entities';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatQuestion)
    private readonly questionRepo: Repository<ChatQuestion>,
    @InjectRepository(ChatSession)
    private readonly sessionRepo: Repository<ChatSession>,
    @InjectRepository(ChatResponse)
    private readonly responseRepo: Repository<ChatResponse>
  ) {}

  async getQuestionByCode(code: string) {
    const question = await this.questionRepo.findOne({ where: { code, active: true } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async listActiveQuestions() {
    return this.questionRepo.find({ where: { active: true }, order: { orderBy: 'ASC' } });
  }

  async startSession(mobile: string) {
    const session = this.sessionRepo.create({ mobile, status: 'active' });
    return this.sessionRepo.save(session);
  }

  async getSession(sessionId: string) {
    const session = await this.sessionRepo.findOne({ where: { sessionId } });
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async saveResponse(
    sessionId: string,
    questionCode: string,
    answerText?: string,
    answerValue?: string
  ) {
    const session = await this.sessionRepo.findOne({ where: { sessionId } });
    if (!session) throw new NotFoundException('Session not found');

    // Try to find the question, but don't fail if it doesn't exist
    let question = await this.questionRepo.findOne({ where: { code: questionCode, active: true } });
    
    // If question doesn't exist, create a temporary one or use a default
    if (!question) {
      // Create a temporary question record for demo purposes
      question = this.questionRepo.create({
        code: questionCode,
        text: `Question: ${questionCode}`,
        questionType: 'text',
        active: true,
        orderBy: 999
      });
      question = await this.questionRepo.save(question);
    }

    const response = this.responseRepo.create({
      sessionId: session.sessionId,
      questionId: question.questionId,
      answerText: answerText ?? null,
      answerValue: answerValue ?? null,
    });
    return this.responseRepo.save(response);
  }

  async getAllSessions() {
    return this.sessionRepo.find({
      order: { createdAt: 'DESC' },
      take: 100 // Limit to recent 100 sessions
    });
  }

  async getSessionResponses(sessionId: string) {
    const session = await this.sessionRepo.findOne({ where: { sessionId } });
    if (!session) throw new NotFoundException('Session not found');

    const responses = await this.responseRepo.find({
      where: { sessionId },
      relations: ['question'],
      order: { createdAt: 'ASC' }
    });

    return {
      session,
      responses
    };
  }
}


