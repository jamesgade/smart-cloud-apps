import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessagingService, CreateConversationDto, CreateMessageDto } from './messaging.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('messaging')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  // Student endpoints
  @Post('conversations')
  @Roles('Student')
  @HttpCode(HttpStatus.CREATED)
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
    @Request() req: any,
  ) {
    const studentId = req.user?.userId;
    const createdBy = req.user?.email || req.user?.username || 'student';
    
    if (!studentId) {
      throw new Error('User ID not found in request. User object: ' + JSON.stringify(req.user));
    }
    
    return await this.messagingService.createConversation(
      createConversationDto,
      studentId,
      createdBy,
    );
  }

  @Get('conversations')
  @Roles('Student')
  async getStudentConversations(@Request() req: any) {
    const studentId = req.user.userId;
    return await this.messagingService.getStudentConversations(studentId);
  }

  @Get('conversations/:conversationId/messages')
  @Roles('Student')
  async getConversationMessages(
    @Param('conversationId') conversationId: string,
    @Request() req: any,
  ) {
    const userId = req.user.userId;
    const messages = await this.messagingService.getConversationMessages(conversationId, userId);
    
    // Mark messages as read when student views them
    await this.messagingService.markMessagesAsRead(conversationId, userId);
    
    return messages;
  }

  @Post('messages')
  @Roles('Student')
  @HttpCode(HttpStatus.CREATED)
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: any,
  ) {
    const senderId = req.user.userId;
    const createdBy = req.user.email || 'student';
    
    return await this.messagingService.createMessage(
      createMessageDto,
      senderId,
      'STUDENT',
      createdBy,
    );
  }

  // Counsellor endpoints
  @Get('counsellor/conversations')
  @Roles('Counsellor', 'Senior Counsellor')
  async getCounsellorConversations(@Request() req: any) {
    return await this.messagingService.getAllConversationsForCounsellors();
  }

  @Patch('conversations/:conversationId/assign')
  @Roles('Counsellor', 'Senior Counsellor')
  async assignConversation(
    @Param('conversationId') conversationId: string,
    @Request() req: any,
  ) {
    const counsellorId = req.user.userId;
    const updatedBy = req.user.email || 'counsellor';
    
    return await this.messagingService.assignConversation(
      conversationId,
      counsellorId,
      updatedBy,
    );
  }

  @Get('counsellor/conversations/:conversationId/messages')
  @Roles('Counsellor', 'Senior Counsellor')
  async getCounsellorConversationMessages(
    @Param('conversationId') conversationId: string,
    @Request() req: any,
  ) {
    const userId = req.user.userId;
    const messages = await this.messagingService.getConversationMessages(conversationId, userId);
    
    // Mark messages as read when counsellor views them
    await this.messagingService.markMessagesAsRead(conversationId, userId);
    
    return messages;
  }

  @Post('counsellor/messages')
  @Roles('Counsellor', 'Senior Counsellor')
  @HttpCode(HttpStatus.CREATED)
  async createCounsellorMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: any,
  ) {
    const senderId = req.user.userId;
    const createdBy = req.user.email || 'counsellor';
    
    return await this.messagingService.createMessage(
      createMessageDto,
      senderId,
      'COUNSELLOR',
      createdBy,
    );
  }

  @Patch('conversations/:conversationId/close')
  @Roles('Counsellor', 'Senior Counsellor')
  async closeConversation(
    @Param('conversationId') conversationId: string,
    @Request() req: any,
  ) {
    const userId = req.user.userId;
    const updatedBy = req.user.email || 'counsellor';
    
    return await this.messagingService.closeConversation(
      conversationId,
      userId,
      updatedBy,
    );
  }

  // Admin endpoints
  @Get('admin/conversations')
  @Roles('Admin')
  async getAllConversations(@Request() req: any) {
    return await this.messagingService.getAllConversationsForAdmins();
  }

  @Get('admin/conversations/:conversationId/messages')
  @Roles('Admin')
  async getAdminConversationMessages(
    @Param('conversationId') conversationId: string,
    @Request() req: any,
  ) {
    const userId = req.user.userId;
    const messages = await this.messagingService.getConversationMessages(conversationId, userId, 'ADMIN');
    
    // Mark messages as read when admin views them
    await this.messagingService.markMessagesAsRead(conversationId, userId);
    
    return messages;
  }

  @Post('admin/messages')
  @Roles('Admin')
  @HttpCode(HttpStatus.CREATED)
  async createAdminMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: any,
  ) {
    const senderId = req.user.userId;
    const createdBy = req.user.email || 'admin';
    
    return await this.messagingService.createMessage(
      createMessageDto,
      senderId,
      'ADMIN',
      createdBy,
    );
  }

  @Patch('admin/conversations/:conversationId/close')
  @Roles('Admin')
  async adminCloseConversation(
    @Param('conversationId') conversationId: string,
    @Request() req: any,
  ) {
    const userId = req.user.userId;
    const updatedBy = req.user.email || 'admin';
    
    return await this.messagingService.closeConversation(
      conversationId,
      userId,
      updatedBy,
    );
  }
}
