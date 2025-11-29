import { Controller, Post, Get, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { AssignedStudentService } from './assigned-student.service';

@ApiTags('Student Assignments')
@Controller('student-assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class AssignedStudentController {
  constructor(private readonly assignedStudentService: AssignedStudentService) {}

  @Post()
  @Roles('Admin', 'Manager')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Assign students to counsellors/admins' })
  async assignStudents(
    @Body() body: { studentIds: string[]; assignedToUserId: string; notes?: string },
    @Request() req: any,
  ) {
    const assignedByUserId = req.user?.userId;
    return await this.assignedStudentService.assignStudents(
      body.studentIds,
      body.assignedToUserId,
      assignedByUserId,
      body.notes,
    );
  }

  @Get()
  @Roles('Admin', 'Manager', 'Senior Counsellor', 'Counsellor')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get assigned students' })
  async getAssignedStudents(@Request() req: any) {
    const user = req.user;
    // Counsellors see only their assigned students, admins see all
    const assignedToUserId = user.userTypeName === 'Admin' ? undefined : user.userId;
    return await this.assignedStudentService.getAssignedStudents(assignedToUserId);
  }

  @Get('counsellors')
  @Roles('Admin', 'Manager')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get available counsellors/admins for assignment' })
  async getAvailableCounsellors() {
    return await this.assignedStudentService.getAvailableCounsellors();
  }

  @Get('students')
  @Roles('Admin', 'Manager', 'Senior Counsellor', 'Counsellor')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get assigned students for appointments - ALL roles see only their assigned students' })
  async getAssignedStudentsForAppointments(@Request() req: any) {
    const user = req.user;
    
    // Extract userId from request - try multiple possible field names
    const currentUserId = user.userId || user.user_id || user.id;
    
    // ALL roles (including admins/managers) should see only their assigned students
    // userId is REQUIRED for all roles
    if (!currentUserId) {
      return []; // Return empty array if no userId found
    }
    
    // Always pass userId to filter by assigned_to
    return await this.assignedStudentService.getAssignedStudentsForAppointments(currentUserId);
  }
}

