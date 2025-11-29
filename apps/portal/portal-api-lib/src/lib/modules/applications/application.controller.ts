import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  Query,
  Logger
} from '@nestjs/common';
import { ApplicationService, CreateApplicationDto, UpdateApplicationDto } from './application.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Applications')
@ApiBearerAuth('access-token')
export class ApplicationController {
  private readonly logger = new Logger(ApplicationController.name);
  
  constructor(
    private readonly applicationService: ApplicationService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager
  ) {}

  @Post()
  @Roles('Student', 'Admin', 'Manager', 'Senior Counsellor', 'Counsellor')
  @ApiOperation({ summary: 'Create a new application' })
  @ApiResponse({ status: 201, description: 'Application created successfully' })
  async createApplication(
    @Body() createDto: CreateApplicationDto,
    @Request() req: any
  ) {
    const userId = req.user?.userId || req.user?.sub;
    return await this.applicationService.createApplication(createDto, userId);
  }

  @Get()
  @Roles('Admin', 'Manager', 'Senior Counsellor', 'Counsellor')
  @ApiOperation({ summary: 'Get all applications - filtered by assigned students for counsellors' })
  @ApiResponse({ status: 200, description: 'Applications retrieved successfully' })
  async getAllApplications(@Request() req: any) {
    const user = req.user;
    
    // Extract userId from request
    const currentUserId = user.userId || user.user_id || user.id;
    
    if (!currentUserId) {
      this.logger.warn(`No userId found - user: ${JSON.stringify(user)}`);
      return [];
    }
    
    // Query role from database instead of using userTypeName
    let roleName: string | null = null;
    try {
      const roleQuery = `
        SELECT r.name as "roleName"
        FROM auth."user" u
        JOIN auth.user_assign_roles uar ON u.user_id = uar.user_id
        JOIN auth.roles r ON uar.role_id = r.role_id
        WHERE u.user_id = $1::uuid
        LIMIT 1
      `;
      const roleResult = await this.entityManager.query(roleQuery, [currentUserId]);
      roleName = roleResult[0]?.roleName || null;
    } catch (error) {
      this.logger.error(`Error fetching role for userId ${currentUserId}:`, error);
    }
    
    // Check if user is admin or manager based on role from database
    const normalizedRoleName = (roleName || '').toLowerCase().trim();
    const isAdminOrManager = 
      normalizedRoleName === 'admin' || 
      normalizedRoleName === 'manager';
    
    // For admins/managers, show all applications
    if (isAdminOrManager) {
      return await this.applicationService.findAll();
    }
    
    // For counsellors/senior counsellors, filter by assigned students
    return await this.applicationService.findByAssignedStudents(currentUserId);
  }

  @Get('student/:studentId')
  @Roles('Student', 'Admin', 'Manager', 'Senior Counsellor', 'Counsellor')
  @ApiOperation({ summary: 'Get applications by student ID' })
  @ApiResponse({ status: 200, description: 'Student applications retrieved successfully' })
  async getStudentApplications(@Param('studentId') studentId: string) {
    return await this.applicationService.findByStudentId(studentId);
  }

  @Get('my-applications')
  @Roles('Student')
  @ApiOperation({ summary: 'Get current student applications' })
  @ApiResponse({ status: 200, description: 'Student applications retrieved successfully' })
  async getMyApplications(@Request() req: any) {
    const studentId = req.user?.studentId || req.user?.sub;
    return await this.applicationService.findByStudentId(studentId);
  }

  @Get('pending')
  @Roles('Admin', 'Manager', 'Senior Counsellor', 'Counsellor')
  @ApiOperation({ summary: 'Get pending applications - filtered by assigned students for counsellors' })
  @ApiResponse({ status: 200, description: 'Pending applications retrieved successfully' })
  async getPendingApplications(@Request() req: any) {
    const user = req.user;
    
    // Extract userId from request
    const currentUserId = user.userId || user.user_id || user.id;
    
    if (!currentUserId) {
      return [];
    }
    
    // Query role from database
    let roleName: string | null = null;
    try {
      const roleQuery = `
        SELECT r.name as "roleName"
        FROM auth."user" u
        JOIN auth.user_assign_roles uar ON u.user_id = uar.user_id
        JOIN auth.roles r ON uar.role_id = r.role_id
        WHERE u.user_id = $1::uuid
        LIMIT 1
      `;
      const roleResult = await this.entityManager.query(roleQuery, [currentUserId]);
      roleName = roleResult[0]?.roleName || null;
    } catch (error) {
      this.logger.error(`Error fetching role for userId ${currentUserId}:`, error);
    }
    
    // Check if user is admin or manager based on role from database
    const normalizedRoleName = (roleName || '').toLowerCase().trim();
    const isAdminOrManager = 
      normalizedRoleName === 'admin' || 
      normalizedRoleName === 'manager';
    
    // For admins/managers, show all pending applications
    if (isAdminOrManager) {
      return await this.applicationService.getPendingApplications();
    }
    
    // For counsellors/senior counsellors, filter by assigned students and pending status
    return await this.applicationService.getPendingApplicationsByAssignedStudents(currentUserId);
  }

  @Get('type/:type')
  @Roles('Admin', 'Manager', 'Senior Counsellor', 'Counsellor')
  @ApiOperation({ summary: 'Get applications by type' })
  @ApiResponse({ status: 200, description: 'Applications by type retrieved successfully' })
  async getApplicationsByType(@Param('type') type: 'LOAN' | 'SCHOLARSHIP' | 'COLLEGE') {
    return await this.applicationService.getApplicationsByType(type);
  }

  @Get(':id')
  @Roles('Admin', 'Manager', 'Senior Counsellor', 'Counsellor', 'Student')
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiResponse({ status: 200, description: 'Application retrieved successfully' })
  async getApplicationById(@Param('id') id: string) {
    return await this.applicationService.findById(id);
  }

  @Put(':id')
  @Roles('Admin', 'Manager', 'Senior Counsellor', 'Counsellor')
  @ApiOperation({ summary: 'Update application' })
  @ApiResponse({ status: 200, description: 'Application updated successfully' })
  async updateApplication(
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationDto,
    @Request() req: any
  ) {
    const userId = req.user?.userId || req.user?.sub;
    return await this.applicationService.updateApplication(id, updateDto, userId);
  }

  @Delete(':id')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Delete application' })
  @ApiResponse({ status: 200, description: 'Application deleted successfully' })
  async deleteApplication(@Param('id') id: string) {
    const result = await this.applicationService.deleteApplication(id);
    return { success: result };
  }
}
