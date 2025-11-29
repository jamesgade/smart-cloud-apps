import { Body, Controller, Get, Put, Req, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { StudentAcademicProfileService } from './student-academic-profile.service';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth/student/profile')
@UseGuards(JwtAuthGuard)
export class StudentAcademicProfileController {
  constructor(
    private readonly service: StudentAcademicProfileService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async getMyProfile(@Req() req: any) {
    const studentId = req.user?.userId;
    const [profile, student] = await Promise.all([
      this.service.getByStudentId(studentId),
      this.authService.getCurrentUserInfo(req),
    ]);
    return { student, profile };
  }

  @Put()
  async updateMyProfile(@Req() req: any, @Body() body: any) {
    const studentId = req.user?.userId;
    const updated = await this.service.upsert(studentId, body);
    const student = await this.authService.getCurrentUserInfo(req);
    return { student, profile: updated };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Super Admin', 'Staff', 'Manager', 'Senior Counsellor', 'Counsellor')
  async getProfileById(@Param('id') id: string, @Req() req: any) {
    const [profile, student] = await Promise.all([
      this.service.getByStudentId(id),
      this.authService.getStudentById(id),
    ]);
    return { student, profile };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Super Admin', 'Staff')
  async updateProfileById(@Param('id') id: string, @Body() body: any) {
    const updated = await this.service.upsert(id, body);
    return { profile: updated };
  }
}


