import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@ApiTags('Appointments')
@Controller('appointments')
@ApiBearerAuth('access-token')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get all appointments for current user' })
  async getAppointments(@Request() req: any) {
    const user = req.user;
    
    // If student, get their appointments (use studentId for students)
    if (user.userTypeName === 'Student') {
      const studentId = user.studentId || user.userId;
      return this.appointmentsService.getAppointmentsByStudent(studentId);
    }
    
    // If counsellor, get appointments assigned to them
    return this.appointmentsService.getAppointmentsByCounsellor(user.userId);
  }

  @Get('counsellors')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get list of available counsellors for booking' })
  async getCounsellors() {
    return this.appointmentsService.getAvailableCounsellors();
  }

  @Get('students')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get list of students for counsellors to book appointments' })
  async getStudents() {
    return this.appointmentsService.getAvailableStudents();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Create new appointment (Student only)' })
  async createAppointment(@Body() payload: any, @Request() req: any) {
    const studentId = req.user.studentId || req.user.userId;
    
    return this.appointmentsService.createAppointment(payload);
  }

  @Patch(':id/confirm')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Confirm appointment (Counsellor only)' })
  async confirmAppointment(
    @Param('id') id: string,
    @Body() body: { counsellor_notes?: string },
    @Request() req: any
  ) {
    return this.appointmentsService.confirmAppointment(id, req.user.userId, body.counsellor_notes);
  }

  @Patch(':id/reject')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Reject appointment (Counsellor only)' })
  async rejectAppointment(
    @Param('id') id: string,
    @Body() body: { rejection_reason?: string },
    @Request() req: any
  ) {
    return this.appointmentsService.rejectAppointment(id, req.user.userId, body.rejection_reason);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Cancel appointment' })
  async cancelAppointment(
    @Param('id') id: string,
    @Body() body: { cancellation_reason?: string },
    @Request() req: any
  ) {
    return this.appointmentsService.cancelAppointment(id, req.user.userId, body.cancellation_reason);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Delete appointment' })
  async deleteAppointment(@Param('id') id: string, @Request() req: any) {
    return this.appointmentsService.deleteAppointment(id, req.user.userId);
  }
}

