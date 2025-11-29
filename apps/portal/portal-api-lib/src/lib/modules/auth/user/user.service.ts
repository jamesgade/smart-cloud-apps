import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { UserTypeService } from './user-type.service';
import { validate } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { UserLoginHistoryService } from './user-login-history.service';
import { User, UserRefreshToken } from '@smart-cloud-apps/common-api-lib';
import config from '../../../config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    private readonly userTypeService: UserTypeService,
    private readonly userLoginHistoryService: UserLoginHistoryService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRefreshToken)
    private readonly userRefreshTokenRepository: Repository<UserRefreshToken>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly entityManager: EntityManager
  ) {}

  async get(userId: string) {
    return this.userRepository.findOneBy({ userId: userId });
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email: email });
  }

  async findByEmail(email: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userAssignRoles', 'userAssignRoles')
      .where('user.email = :email', { email })
      .getRawOne();
  }

  async findByEmailData(email: string, req?: any): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userType', 'userType')
      .leftJoinAndSelect('user.userAssignRoles', 'userAssignRoles')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) {
      const log = `User not found: ${email}`;
      await this.userLoginHistoryService.userLoginHistory(
        null,
        req,
        log,
        'FAILED'
      );
      throw new HttpException(log, HttpStatus.UNAUTHORIZED);
    }
    if (user.status === 'INVITATION-SENT') {
      const log = `User INVITATION-SENT to: ${email}, Please activate your account.`;
      await this.userLoginHistoryService.userLoginHistory(
        null,
        req,
        log,
        'FAILED'
      );

      throw new HttpException(log, HttpStatus.UNAUTHORIZED);
    }

    if (user.status !== 'ACTIVE') {
      const log = `User is IN-ACTIVE: ${email}, Please contact the administrator.`;
      await this.userLoginHistoryService.userLoginHistory(
        null,
        req,
        log,
        'FAILED'
      );

      throw new HttpException(log, HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async findByUserId(userId: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userType', 'userType')
      .innerJoinAndSelect('user.userAssignRoles', 'userAssignRoles')
      .where('user.userId = :userId', { userId })
      .getOne();

    if (!user) {
      throw new HttpException(
        `User not found: ${user?.email}`,
        HttpStatus.UNAUTHORIZED
      );
    }
    if (user.status === 'INVITATION-SENT') {
      throw new HttpException(
        `User INVITATION-SENT to: ${user.email}, Please activate your account.`,
        HttpStatus.UNAUTHORIZED
      );
    }

    if (user.status !== 'ACTIVE') {
      throw new HttpException(
        `User is IN-ACTIVE: ${user?.email}, Please contact the administrator.`,
        HttpStatus.UNAUTHORIZED
      );
    }

    return user;
  }

  async updateRefreshTokenById(
    userId: string,
    refreshToken?: string,
    sessionIdentifier?: string
  ): Promise<string> {
    if (refreshToken) {
      const hashedRefreshToken = await argon2.hash(refreshToken);
      const userRefreshToken = new UserRefreshToken();
      userRefreshToken.userId = userId;
      userRefreshToken.refreshtoken = hashedRefreshToken;
      userRefreshToken.updatedAt = new Date();
      if (sessionIdentifier) {
        userRefreshToken.sessionIdentifier = sessionIdentifier;
        await this.userRefreshTokenRepository.update(
          {
            userId: userRefreshToken.userId,
            sessionIdentifier: userRefreshToken.sessionIdentifier,
          },
          userRefreshToken
        );
      } else {
        userRefreshToken.sessionIdentifier = uuidv4();
        await this.userRefreshTokenRepository.insert(userRefreshToken);
      }

      return userRefreshToken.sessionIdentifier;
    } else {
      return null;
    }
  }

  async getRefreshTokenByUserId(userId: string, sessionIdentifier: string) {
    return await this.userRefreshTokenRepository.findOneBy({
      userId: userId,
      sessionIdentifier: sessionIdentifier,
    });
  }

  //   async findByUserIdAndOrgId(
  //   userId: string,
  //   organizationId: string
  // ): Promise<User> {
  //   const user = await this.userRepository
  //     .createQueryBuilder('user')
  //     .innerJoinAndSelect('user.userOrganizations', 'userOrganizations')
  //     .innerJoinAndSelect('user.userType', 'userType')
  //     .innerJoinAndSelect('userOrganizations.organization', 'organization')
  //     .where('user.userId = :userId', { userId })
  //     .andWhere('organization.organizationId = :organizationId', {
  //       organizationId,
  //     })
  //     .getOne();

  //   return user;
  // }

  // ------
  // async findAllPermissionsOfUser(
  //   userId: string,
  //   reqUrl: string,
  //   reqMethod: string
  // ): Promise<Permissions[]> {
  //   const cacheKey = `${userId}:${reqUrl}:${reqMethod}`;

  //   // If ENABLE_CACHING = true, then get all permissions from cache for cache Key of userId + reqUrl + reqMethod
  //   if(config.ENABLE_CACHING){
  //     const cachedPermissions = await this.cacheManager.get<Permissions[]>(cacheKey);
  //     if (cachedPermissions) {
  //       return cachedPermissions;
  //     }
  //   }

  //   const builder = await this.userRepository.createQueryBuilder('user');
  //   builder
  //     .innerJoinAndSelect('user.userAssignRoles', 'userAssignRoles')
  //     .innerJoinAndSelect('userAssignRoles.role', 'role')
  //     .innerJoinAndSelect('role.rolePermissions', 'rolePermissions')
  //     .innerJoinAndSelect('rolePermissions.permission', 'permission')
  //     .innerJoinAndSelect('permission.permissionObject', 'object')
  //     .where('user.userId = :userId', { userId: userId })
  //     .andWhere(
  //       `(CASE WHEN permission.overrideObjectUrl = true THEN permission.path ELSE CONCAT(object.requestUrl, permission.path) END) = :requestUrl`,
  //       {
  //         requestUrl: reqUrl,
  //       }
  //     )
  //     .andWhere('permission.requestMethod = :requestMethod', {
  //       requestMethod: reqMethod,
  //     })
  //     .getOne();

  //   const result = await builder.getOne();

  //   const permissions =
  //     result && result.userAssignRoles
  //       ? result.userAssignRoles.flatMap((ua) =>
  //           ua.role.rolePermissions.map((rp) => {
  //             return rp.permission;
  //           })
  //         )
  //       : [];

  //   // If ENABLE_CACHING = true, then cache all permissions for cache Key of userId + reqUrl + reqMethod
  //   if(config.ENABLE_CACHING){
  //     await this.cacheManager.set(cacheKey, permissions, config.REDIS_TTL);
  //   }
  //   return permissions;
  // }

  async findUserPermissions(userId: string) {
    const cacheKey = `${userId}`;

    // If ENABLE_CACHING = true, then get all permissions from cache for userId caching key
    if (config.ENABLE_CACHING) {
      const cachedPermissions = await this.cacheManager.get<Permissions[]>(
        cacheKey
      );
      if (cachedPermissions) {
        return cachedPermissions;
      }
    }
    const query = `
      select p.action as "actionName", r."name" as "roleName"  from auth.user u
      join auth.user_assign_roles uar on uar.user_id = u.user_id
      join auth.roles r on r.role_id = uar.role_id
      join auth.role_permissions rp on rp.role_id = r.role_id
      join auth.permissions p on p.permission_id = rp.permission_id
      join auth.permission_objects pb on pb.permission_object_id  = p.object_id 
      where u.user_id = $1
      `;
    const permissionData = await this.entityManager.query(query, [userId]);

    // If ENABLE_CACHING = true, then cache all permissions for caching key userId
    if (config.ENABLE_CACHING) {
      await this.cacheManager.set(
        cacheKey,
        { data: permissionData },
        config.REDIS_TTL
      );
    }

    return { data: permissionData };
  }
}
