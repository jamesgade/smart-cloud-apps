import { 
  Controller, 
  UseGuards, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query 
} from '@nestjs/common';
import { 
  StudentAssignedCollegeService, 
  AssignCollegeDto, 
  UpdateAssignmentDto 
} from './student-assigned-college.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { StudentAssignedCollege } from '@smart-cloud-apps/common-api-lib';
import { 
  ApiTags, 
  ApiBearerAuth, 
  ApiOperation, 
  ApiParam, 
  ApiQuery, 
  ApiBody 
} from '@nestjs/swagger';

@Controller('student-college-assignments')
@UseGuards(JwtAuthGuard)
@ApiTags('Student College Assignments')
@ApiBearerAuth('access-token')
export class StudentAssignedCollegeController {
  constructor(private readonly service: StudentAssignedCollegeService) {}

  @Post('assign')
  @ApiOperation({ summary: 'Assign a student to a college' })
  @ApiBody({ type: Object, description: 'Assignment details' })
  async assignStudentToCollege(@Body() dto: AssignCollegeDto) {
    return this.service.assignStudentToCollege(dto);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get all college assignments for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiQuery({ 
    name: 'includeInactive', 
    description: 'Include inactive assignments', 
    required: false, 
    type: Boolean 
  })
  async getStudentCollegeAssignments(
    @Param('studentId') studentId: string,
    @Query('includeInactive') includeInactive?: boolean
  ) {
    return this.service.getStudentCollegeAssignments(studentId, includeInactive);
  }

  @Get('college/:collegeId')
  @ApiOperation({ summary: 'Get all student assignments for a college' })
  @ApiParam({ name: 'collegeId', description: 'College ID' })
  @ApiQuery({ 
    name: 'assignmentType', 
    description: 'Filter by assignment type', 
    required: false 
  })
  async getCollegeStudentAssignments(
    @Param('collegeId') collegeId: string,
    @Query('assignmentType') assignmentType?: string
  ) {
    return this.service.getCollegeStudentAssignments(collegeId, assignmentType);
  }

  @Put(':assignmentId')
  @ApiOperation({ summary: 'Update assignment status and details' })
  @ApiParam({ name: 'assignmentId', description: 'Assignment ID' })
  @ApiBody({ type: Object, description: 'Update details' })
  async updateAssignment(
    @Param('assignmentId') assignmentId: string,
    @Body() dto: UpdateAssignmentDto & { updatedBy: string }
  ) {
    const { updatedBy, ...updateData } = dto;
    return this.service.updateAssignment(assignmentId, updateData, updatedBy);
  }

}