import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('question')
  async getQuestionByCode(@Query('code') code: string) {
    return this.chatService.getQuestionByCode(code);
  }

  @Get('questions')
  async listQuestions() {
    return this.chatService.listActiveQuestions();
  }

  @Post('session')
  async startSession(@Body() body: { mobile: string }) {
    return this.chatService.startSession(body.mobile);
  }

  @Get('session/:sessionId')
  async getSession(@Param('sessionId') sessionId: string) {
    return this.chatService.getSession(sessionId);
  }

  @Post('response')
  async submitAnswer(
    @Body()
    body: {
      sessionId: string;
      questionCode: string;
      answerText?: string;
      answerValue?: string;
    }
  ) {
    return this.chatService.saveResponse(
      body.sessionId,
      body.questionCode,
      body.answerText,
      body.answerValue
    );
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Manager', 'Senior Counsellor', 'Counsellor')
  async getAllSessions() {
    return this.chatService.getAllSessions();
  }

  @Get('sessions/:sessionId/responses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Manager', 'Senior Counsellor', 'Counsellor')
  async getSessionResponses(@Param('sessionId') sessionId: string) {
    return this.chatService.getSessionResponses(sessionId);
  }
}


