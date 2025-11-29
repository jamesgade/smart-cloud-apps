import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import {
  Controller,
  UseGuards,
  UseInterceptors,
  Request,
  Get,
  Patch,
  Param,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@dataui/crud';
import { ProviderService } from './provider.service';
// import {
//   CreateUserDto,
//   UpdateUserDto,
//   UserStatusUpdateDto,
// } from '@miyo-cloud-apps/provider/provider-common';
// import { GetManyUserInfoDto } from './dto/get-many-user-data.dto';
import { User } from '@smart-cloud-apps/common-api-lib';
import { CreateUserDto, UpdateUserDto } from '@smart-cloud-apps/portal-common';


class CreateProviderDto {
  @ApiProperty({
    description: 'Email address of the provider',
    example: 'provider@example.com',
    format: 'email'
  })
  email!: string;

  @ApiProperty({
    description: 'First name of the provider',
    example: 'John',
    minLength: 1,
    maxLength: 50
  })
  firstName!: string;

  @ApiProperty({
    description: 'Last name of the provider',
    example: 'Doe',
    minLength: 1,
    maxLength: 50
  })
  lastName!: string;

  @ApiProperty({
    description: 'Middle initial of the provider',
    example: 'M',
    required: false,
    maxLength: 150
  })
  middleInitial?: string;

  @ApiProperty({
    description: 'User type ID for the provider role',
    example: '86f0ee54-485d-4a2a-87d2-5c0853764d41',
    format: 'uuid'
  })
  userTypeId!: string;
}

@Controller('provider')
@ApiTags('Provider')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin', 'Super Admin', 'Staff')
@Crud({
  model: {
    type: User,
  },
  routes: {
    exclude: ['deleteOneBase', 'replaceOneBase', 'createManyBase'],
  },
  dto: {
    create: CreateUserDto,
    update: UpdateUserDto,
  },
  params: {
    id: {
      field: 'userId',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    limit: 10,
    maxLimit: 100,
    sort: [
      {
        field: 'firstName',
        order: 'ASC',
      },
    ],
    join: {
      userType: {
        eager: true,
      },
      userAssignRoles: {
        eager: true,
      },
      'userAssignRoles.role': {
        eager: true,
        alias: 'role',
      },
    },
  },
  serialize: {
    get: false,
    // getMany: GetManyUserInfoDto,
    getMany: false,
    create: false,
    createMany: false,
    update: false,
    replace: false,
    delete: false,
  },
})
@CrudAuth({
  property: 'user',

})
@ApiBearerAuth('access-token')
export class ProviderController implements CrudController<User> {
  constructor(public service: ProviderService) {}

  @Override('getManyBase')
  async getMany(@ParsedRequest() pReq: CrudRequest, @Request() req: any) {
    // Handle pagination parameters from the frontend
    const page = parseInt(req.query.page || '1');
    const pageSize = parseInt(req.query.pageSize || '10');
    
    // Debug logging
    console.log('Backend Pagination:', { 
      queryPage: req.query.page, 
      queryPageSize: req.query.pageSize,
      parsedPage: page, 
      parsedPageSize: pageSize,
      originalParsed: pReq.parsed 
    });
    
    // Set pagination in the parsed request
    pReq.parsed.limit = pageSize;
    pReq.parsed.page = page;
    pReq.parsed.offset = (page - 1) * pageSize;
    
    console.log('Updated parsed request:', pReq.parsed);
    
    return await this.service.getMany(pReq);
  }

  @Override('createOneBase')
    @ApiBody({
    type: CreateProviderDto,
    description: 'Provider creation data',
    examples: {
      example1: {
        summary: 'Basic provider creation',
        value: {
          email: 'provider@example.com',
          firstName: 'John',
          lastName: 'Doe',
          middleInitial: 'M',
          userTypeId: '86f0ee54-485d-4a2a-87d2-5c0853764d41'
        }
      }
    }
  })
  async createOne(
    // @ParsedRequest() pReq: CrudRequest,
    @ParsedBody() dto: any,
    @Request() req: any
  ) {
    return await this.service.createUser(dto, req);
  }

  @Override('updateOneBase')
  async updateOne(
    @ParsedRequest() pReq: CrudRequest,
    @ParsedBody() dto: UpdateUserDto,
    @Request() req: any
  ) {
    const userInfo = await this.service.getOne(pReq);
    if (dto.email && dto.email.toLowerCase() !== userInfo?.email.toLowerCase()) {
      await this.service.updateEmail(dto, req, userInfo);
    }
    const data = await this.service.updateUser(dto, userInfo, req);
    await this.service.updateOne(pReq, data);
    await this.service.deleteUserCache(dto, userInfo);
    return {
      message: `User updated successfully`,
      status: HttpStatus.OK,
    };
  }

  @Patch('edit/:id')
  async editUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any
  ) {
    try {
      
      const user = await this.service.findUserById(userId);
      if (!user) {
        return {
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      if (updateUserDto.email && updateUserDto.email.toLowerCase() !== user.email.toLowerCase()) {
        await this.service.updateEmail(updateUserDto, req, user);
      }

      const updatedUser = await this.service.updateUser(updateUserDto, user, req);
      await this.service.deleteUserCache(updateUserDto, user);
      
      return {
        message: 'User updated successfully',
        data: updatedUser,
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.error('Edit user error:', error);
      throw error;
    }
  }

  // @Patch('sign/:id')
  // async updateUserField(@Param('id') userId: string, @Body() data) {
  //   const signaled = await this.service.updateUserField(userId, data);
  //   return signaled;
  // }

  // @Patch('status/:id')
  // async StatusUpdate(
  //   @Param('id') userId: string,
  //   @Body() data: UserStatusUpdateDto,
  //   @Request() req
  // ) {
  //   return await this.service.userStatusUpdate(userId, data, req);
  // }

  // @Get('invite-sent/:id')
  // async reInvitationSent(@Param('id') userId: string, @Request() req) {
  //   return await this.service.userReInvitationSent(userId, req);
  // }
}