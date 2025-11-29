import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ClientService } from '../client/client.service';

@ApiTags('Permission')
@Controller('user-permission')
export class PermissionController {
  constructor(
    private readonly userService: UserService,
    private readonly clientService: ClientService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  // @ApiHeader({
  //   name: 'sitepath',
  //   required: true,
  // })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get user permissions' })
  @ApiBearerAuth('access-token')
  async getUserPermissions(@Req() req) {
    if (req.user.userTypeName === 'Student') {
      const permissions = this.clientService.findClientPermissions(
        req.user.userId
      );
      return permissions;
    }

    const permissions = this.userService.findUserPermissions(req.user.userId);
    return permissions;
  }
}
