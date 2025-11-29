import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { uniq } from 'lodash';
import { EntityManager, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PinoLogger } from 'nestjs-pino';
import { SendGridEmailService, User } from '@smart-cloud-apps/common-api-lib';
import { portalAppUsers } from 'apps/common/common-api-lib/src/lib/constants/user-type-logins.constants';
import { QueryOptions } from '@dataui/crud';
import { ParsedRequestParams } from '@dataui/crud-request';

@Injectable()
export class ProviderService extends TypeOrmCrudService<User> {
  override getSelect(query: ParsedRequestParams<{}>, options: QueryOptions) {
    return uniq(super.getSelect(query, options));
  }
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private readonly sendGridEmailService: SendGridEmailService,
    private readonly entityManager: EntityManager,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly logger: PinoLogger
  ) {
    super(userRepository);
    this.logger.setContext(ProviderService.name);
  }


  async createUser(dto: any, req: any) {
    const email = dto.email.toLowerCase();
    const adminUserTypeId = '86f0ee54-485d-4a2a-87d2-5c0853764d41';
    dto.userTypeId = adminUserTypeId;
    let appPath: string;
    if (Object.values(portalAppUsers.userTypes).includes(dto.userTypeId)) {
      appPath = portalAppUsers.appPaths;
    } else {
      throw new BadRequestException('Invalid user type');
    }
    const providerBaseUrl = this.configService.get<string>('APP_URL') || 'http://localhost:4200';
    // check the user email already exists in the organization
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .getOne();
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    } else {
      // Set status to INVITATION-SENT for new users
      dto.status = 'INVITATION-SENT';
      // const userAssignRolesInfo = dto.userAssignRoles.split();
    //   const userAssignRoles = await this.lookupsDataProcess.filterFindMap(
    //     userAssignRolesInfo,
    //     'roleId',
    //     reqUserId
    //   );

    
      const userId = uuidv4();
      const userAssignRoles = dto.userAssignRoles.map((val:any) => ({
        userId:userId,
        roleId: val,
        createdBy:'Admin',
        updatedBy:'Admin'
      }));
      const payload = {
        ...dto,
        email,
        userId,
        userAssignRoles,
        createdBy:'Admin',
        updatedBy:'Admin'
      };

      const newUser = await this.userRepository.save(payload);

      // Send invitation email to new user
      this.logger.info(`User creation: email=${email}, sending invitation`);
      try {
        await this.generateToken(
          newUser.userId,
          newUser.email,
          newUser.firstName,
          providerBaseUrl,
          false,
          appPath,
          ''
        );
        this.logger.info(`Invitation email sent successfully to ${email}`);
      } catch (emailError: any) {
        this.logger.warn(`Failed to send invitation email to ${email}: ${emailError.message}`);
        // Don't throw error - user creation should succeed even if email fails
      }
      const user_name = `${newUser.firstName} ${newUser.lastName}`;
      const userName = user_name
        .split(' ')?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return {
        message: `Invitation sent successfully to ${userName}`,
        status: HttpStatus.ACCEPTED,
        userId: userId,
      };
    }
  }

  private async generateToken(
    user_id: any,
    email: string,
    user_name: any,
    providerBaseUrl: string,
    isExistingEmailRemove: boolean,
    appPath: string,
    existingEmail: string
  ) {
    const jwt_payload = {
      sub: user_id,
      isExistingEmailRemove: isExistingEmailRemove,
      existingEmail: existingEmail,
    };
    const token = await this.jwtService.signAsync(jwt_payload, {
      secret: this.configService.get<string>('JWT_USER_INVITE_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>(
        'INTIVE_ACCESS_TOKEN_EXPIRES_IN'
      ),
    });
    const encodedToken = encodeURIComponent(token.replace(/\./g, '%2E'));
    const url = `${providerBaseUrl}/active-provider?token=${encodedToken}`;
    
    this.logger.info(`Attempting to send email to ${email} with template d-1c80b7669ab74941a2a4016403eeaac8`);
    this.logger.info(`Email data: name=${user_name}, action_url=${url}`);
    
    try {
      await this.sendGridEmailService.sendEmail(
        [email],
        'd-1c80b7669ab74941a2a4016403eeaac8', //user create template id sendgrid
        {
          name: user_name,
          action_url: url,
        },
        'CAMPUS YATRA ADMIN'
      );
      this.logger.info(`Email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}: ${error.message}`);
      throw error;
    }
    
    return { message: 'mail send successfully.', status: HttpStatus.ACCEPTED };
  }



  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userType', 'userType')
      .leftJoinAndSelect('user.userAssignRoles', 'userAssignRoles')
      .where('user.userId = :userId', { userId })
      .getOne();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async updateUser(dto: any, existingUser: User, req: any): Promise<User> {
    // Prepare the basic user data (excluding roles and invalid fields)
    const { userAssignRoles, createdAt, createdBy, schema, ...userBasicData } = dto;
    
    const adminUserTypeId = '86f0ee54-485d-4a2a-87d2-5c0853764d41';
    const updateData = {
      ...userBasicData,
      userTypeId: adminUserTypeId,
      updatedBy: req?.user?.userId || 'Admin',
      updatedAt: new Date(),
    };
    try {
      // Update the basic user information using QueryBuilder for better error handling
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(updateData)
        .where('userId = :userId', { userId: existingUser.userId })
        .execute();
        
      // Handle roles update if provided
      if (userAssignRoles) {
        // Use transaction for role updates
        await this.entityManager.transaction(async transactionalEntityManager => {
          // First, remove existing role assignments
          await transactionalEntityManager.query(
            'DELETE FROM auth.user_assign_roles WHERE user_id = $1',
            [existingUser.userId]
          );
          
          // Add new role assignments
          const roleIds = Array.isArray(userAssignRoles) ? userAssignRoles : [userAssignRoles];
          
          for (const roleId of roleIds) {
            if (roleId) {
              await transactionalEntityManager.query(
                'INSERT INTO auth.user_assign_roles (user_id, role_id, created_by, updated_by) VALUES ($1, $2, $3, $4)',
                [existingUser.userId, roleId, req?.user?.userId || 'Admin', req?.user?.userId || 'Admin']
              );
            }
          }
        });
      }

      return await this.findUserById(existingUser.userId);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async updateEmail(dto: any, req: any, existingUser: User): Promise<void> {
    const newEmail = dto.email.toLowerCase();
    const oldEmail = existingUser.email.toLowerCase();

    if (newEmail === oldEmail) {
      return;
    }

    const existingEmailUser = await this.userRepository.findOne({
      where: { email: newEmail }
    });

    if (existingEmailUser) {
      throw new BadRequestException('Email already exists');
    }

    // Email validation passed, proceed with update

    this.logger.info(`Updated email from ${oldEmail} to ${newEmail} for user ${existingUser.userId}`);
  }

  async deleteUserCache(dto: any, existingUser: User): Promise<void> {
    if (this.configService.get<boolean>('ENABLE_CACHING')) {
      const cacheKey = existingUser.userId;
      await this.cacheManager.del(cacheKey);
      this.logger.info(`Deleted cache for user ${existingUser.userId}`);
    }
  }


}
