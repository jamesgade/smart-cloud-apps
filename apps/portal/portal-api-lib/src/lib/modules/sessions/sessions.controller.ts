import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Response,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('launch')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ description: 'Launch video session from appointment (Counsellor only)' })
  async launchSession(@Body() body: { appointment_id: string }, @Request() req: any) {
    return this.sessionsService.launchSession(body.appointment_id, req.user.userId);
  }

  @Get(':id/join')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ description: 'Get token to join video session' })
  async getJoinToken(
    @Param('id') sessionId: string,
    @Query('token') token: string,
    @Request() req: any
  ) {
    return this.sessionsService.getJoinToken(sessionId, req.user.userId);
  }

  @Post(':id/end')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ description: 'End video session' })
  async endSession(@Param('id') sessionId: string, @Request() req: any) {
    return this.sessionsService.endSession(sessionId, req.user.userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ description: 'Get session details' })
  async getSession(@Param('id') sessionId: string) {
    return this.sessionsService.getSession(sessionId);
  }

  @Get('appointment/:appointmentId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ description: 'Get session by appointment ID' })
  async getSessionByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.sessionsService.getSessionByAppointment(appointmentId);
  }

  @Get('appointment/:appointmentId/recording/download')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ description: 'Download video recording for appointment' })
  async downloadAppointmentRecording(
    @Param('appointmentId') appointmentId: string
  ) {
    return this.sessionsService.downloadAppointmentRecording(appointmentId);
  }

  @Get('appointment/:appointmentId/recording/stream')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ description: 'Stream video recording for appointment' })
  async streamAppointmentRecording(
    @Param('appointmentId') appointmentId: string,
    @Response() res: any,
    @Request() req: any
  ) {
    return this.sessionsService.streamAppointmentRecording(appointmentId, res, req.user.userId);
  }

  @Post('composition-webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Webhook for Twilio composition status updates' })
  async compositionWebhook(@Body() body: any) {
    // Handle composition status updates from Twilio
    console.log('Composition webhook received:', JSON.stringify(body, null, 2));
    
    if (body.StatusCallbackEvent === 'composition-available') {
      console.log(`✅ Composition ${body.CompositionSid} is now available for download`);
      console.log(`   Room SID: ${body.RoomSid}`);
      console.log(`   Size: ${body.Size} bytes`);
      console.log(`   Duration: ${body.Duration} seconds`);
    } else if (body.StatusCallbackEvent === 'composition-failed') {
      console.log(`❌ Composition ${body.CompositionSid} failed: ${body.StatusCallbackReason}`);
    } else if (body.StatusCallbackEvent === 'composition-progress') {
      console.log(`🔄 Composition ${body.CompositionSid} in progress...`);
    }
    
    return { success: true };
  }

  @Post(':sessionId/create-composition')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ description: 'Manually create composition for session (for testing)' })
  async createComposition(
    @Param('sessionId') sessionId: string,
    @Request() req: any
  ) {
    return this.sessionsService.createCompositionForSession(sessionId, req.user.userId);
  }

  @Get(':sessionId/debug-recordings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ description: 'Debug recordings for session (for testing)' })
  async debugRecordings(
    @Param('sessionId') sessionId: string,
    @Request() req: any
  ) {
    return this.sessionsService.debugSessionRecordings(sessionId, req.user.userId);
  }
}

