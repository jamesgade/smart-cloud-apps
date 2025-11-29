import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ActiveProviderService } from './active-provider/active-provider.service';
import { ActiveProviderController } from './active-provider/active-provider.controller';
import KeyvRedis, { createCluster } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { ProviderController } from './provider.controller';
import { SendGridEmailService, User, UserAssignRoles, UserType, Roles, Student, UserRefreshToken, UserLoginHistory } from '@smart-cloud-apps/common-api-lib';
import { RolesGuard } from '../guards/roles.guard';
import { UserService } from '../user/user.service';
import { UserTypeService } from '../user/user-type.service';
import { UserLoginHistoryService } from '../user/user-login-history.service';
import { StudentService } from '../student/student.service';
import config from '../../../config';

@Module({
  controllers: [
    ProviderController,
    ActiveProviderController,
  ],
  providers: [
    SendGridEmailService,
    ProviderService,
    JwtService,
    ActiveProviderService,
    RolesGuard,
    UserService,
    UserTypeService,
    UserLoginHistoryService,
    StudentService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserType,
      UserAssignRoles,
      UserRefreshToken,
      UserLoginHistory,
      Roles,
      Student
    ]),
    CacheModule.registerAsync(
      config.ENABLE_CACHING
        ? {
            useFactory: async () => {
              return {
                isGlobal: true,
                ttl: config.REDIS_TTL,
                stores: [
                  // If you need in-memory cache, uncomment the code below.
                  // new Keyv({
                  //   store: new CacheableMemory({
                  //     ttl: config.REDIS_TTL,
                  //     lruSize: 5000,
                  //   }),
                  // }),
                  new KeyvRedis(
                    createCluster({
                      rootNodes: [
                        {
                          url: `redis://${config.REDIS_USERNAME}:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`,
                        },
                      ],
                    })
                  ),
                ],
              };
            },
          }
        : {
            useFactory: async () => ({
              isGlobal: true,
              ttl: config.REDIS_TTL,
            }),
          }
    ),
  ],
})
export class ProviderModule {}