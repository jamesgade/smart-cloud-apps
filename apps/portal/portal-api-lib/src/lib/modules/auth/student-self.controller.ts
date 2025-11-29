import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth/student')
@UseGuards(JwtAuthGuard)
export class StudentSelfController {
  constructor(private readonly authService: AuthService) {}

  @Get('details')
  async getMyDetails(@Req() req: any) {
    const studentId = req.user?.userId;
    return await this.authService.getStudentById(studentId);
  }
}


