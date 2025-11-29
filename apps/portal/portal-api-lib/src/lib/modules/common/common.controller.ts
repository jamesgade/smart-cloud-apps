import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles as RolesDecorator } from '../auth/decorators/roles.decorator';
import { CommonService } from './common.service';

@Controller('common')
@ApiTags('Common')
@UseGuards(JwtAuthGuard, RolesGuard)
@RolesDecorator('Admin', 'Manager', 'Senior Counsellor', 'Counsellor')
@ApiBearerAuth('access-token')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('roles')
  async getRoles() {
    return await this.commonService.getRolesExcludingStudent();
  }
}