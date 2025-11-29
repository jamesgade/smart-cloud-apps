import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Put,
  Delete,
  Param,
  Req,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { PinoLogger } from 'nestjs-pino';
import {
  AuthDto,
  AuthStudentDto,
  AuthStudentRegisterDto,
} from '@smart-cloud-apps/portal-common';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Sign in with valid credentials and domain' })
  async signin(@Body() authDto: AuthDto, @Req() req: any) {
    const tokens = await this.authService.signinUser(
      authDto.username,
      authDto.password,
      authDto.path || '',
      authDto.otp || null,
      req
    );
    
    return tokens;
  }

  @Post('signin-student')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Sign in with valid credentials and domain' })
  async signinStudent(@Body() studentDto: AuthStudentDto, @Req() req: any) {
    return await this.authService.signinStudent(studentDto, req);
  }

  @Post('signup-student')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Sign up with valid credentials and domain' })
  async signupStudent(@Body() studentDto: AuthStudentRegisterDto, @Req() req: any) {
    return await this.authService.signupStudent(studentDto, req);
  }

  @Post('resend-otp-student-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Resend OTP for student login' })
  async resendOtpStudentLogin(@Body() body: { mobilePhone: string }, @Req() req: any) {
    return await this.authService.resendOtpStudentLogin(body.mobilePhone, req);
  }

  @Post('resend-otp-student-register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Resend OTP for student registration' })
  async resendOtpStudentRegister(@Body() body: { mobilePhone: string }, @Req() req: any) {
    return await this.authService.resendOtpStudentRegister(body.mobilePhone, req);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Send OTP to email for password reset' })
  async forgotPassword(@Body() body: { email: string }, @Req() req: any) {
    return await this.authService.forgotPassword(body.email, req);
  }

  @Post('reset-password-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Reset password with OTP verification' })
  async resetPasswordWithOtp(@Body() body: { email: string; otp: string; password: string; confirmPassword: string }, @Req() req: any) {
    return await this.authService.resetPasswordWithOtp(body.email, body.otp, body.password, body.confirmPassword, req);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Reset password with token' })
  async resetPassword(@Body() body: { token: string; newPassword: string }, @Req() req: any) {
    return await this.authService.resetPassword(body.token, body.newPassword, req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('current-user')
  @ApiOperation({
    description: 'Current User Info',
  })
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Req() req: any) {
    
    try {
      const result = await this.authService.getCurrentUserInfo(req);
      return result;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      throw error;
    }
  }

  // @UseGuards(RefreshTokenGuard)
  // @HttpCode(HttpStatus.OK)
  // @ApiBearerAuth('refresh-token')
  // @Get('refresh')
  // @ApiOperation({ description: 'Get access token using valid refresh token' })
  // refreshTokens(@Req() req: any) {
  //   return this.authService.refreshTokens(
  //     req.user.userId,
  //     req.user.refreshToken,
  //     req.user.identifier
  //   );
  // }

  @Get('logout')
  @ApiOperation({ description: 'Logout' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(200)
  async logOut(@Req() req: any) {
    await this.authService.logout(req);
    req.res.setHeader('authorization', null);
  }

  @Get('courses')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get list of available courses' })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiBearerAuth('access-token')
  // @Roles('Student', 'Admin', 'Super Admin', 'Staff')
  async getCourses() {
    return await this.authService.getCourses();
  }

  @Get('students')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get list of all students' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles('Admin', 'Super Admin', 'Staff')
  async getStudents() {
    return await this.authService.getStudents();
  }

  @Post('students')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Create a new student (Admin only, no OTP required)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles('Admin', 'Super Admin', 'Staff')
  async createStudent(@Body() studentDto: AuthStudentRegisterDto, @Req() req: any) {
    return await this.authService.createStudent(studentDto, req);
  }

  @Get('students/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get student details with applications, colleges, and followups' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles('Admin', 'Super Admin', 'Staff')
  async getStudentById(@Param('id') id: string) {
    return await this.authService.getStudentById(id);
  }

  @Put('students/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Update student information' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles('Admin', 'Super Admin', 'Staff')
  async updateStudent(@Param('id') id: string, @Body() studentDto: AuthStudentRegisterDto, @Req() req: any) {
    return await this.authService.updateStudent(id, studentDto, req);
  }

  @Delete('students/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Soft delete student (set status to IN-ACTIVE)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles('Admin', 'Super Admin', 'Staff')
  async deleteStudent(@Param('id') id: string, @Req() req: any) {
    return await this.authService.deleteStudent(id, req);
  }

  @Get('students/:id/followups')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get student followups' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles('Admin', 'Super Admin', 'Staff')
  async getStudentFollowups(@Param('id') id: string) {
    return await this.authService.getStudentFollowups(id);
  }

  @Post('students/:id/followups')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Create a new followup for student' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles('Admin', 'Super Admin', 'Staff')
  async createFollowup(@Param('id') id: string, @Body() followupDto: any, @Req() req: any) {
    return await this.authService.createFollowup(id, followupDto, req);
  }

  @Put('students/followups/:followupId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Update a followup' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles('Admin', 'Super Admin', 'Staff')
  async updateFollowup(@Param('followupId') followupId: string, @Body() followupDto: any, @Req() req: any) {
    return await this.authService.updateFollowup(followupId, followupDto, req);
  }

  @Get('students/followups/upcoming')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get upcoming followups for current user' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles('Admin', 'Super Admin', 'Manager', 'Senior Counsellor', 'Counsellor')
  async getUpcomingFollowups(@Req() req: any) {
    const counsellorId = req.user?.userId;
    return await this.authService.getUpcomingFollowups(counsellorId);
  }

  @Get('assigned-students/followups')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get followups for assigned students' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles('Admin', 'Super Admin', 'Manager', 'Senior Counsellor', 'Counsellor')
  async getAssignedStudentsFollowups(@Req() req: any) {
    const userId = req.user?.userId;
    return await this.authService.getAssignedStudentsFollowups(userId);
  }

  @Delete('students/followups/:followupId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Delete a followup' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles('Admin', 'Super Admin', 'Staff')
  async deleteFollowup(@Param('followupId') followupId: string) {
    return await this.authService.deleteFollowup(followupId);
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Health check endpoint' })
  healthCheck() {
    return { status: 'API is running', timestamp: new Date().toISOString() };
  }
}