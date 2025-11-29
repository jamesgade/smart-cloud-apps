import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JWTAuthService } from './jwt/jwt-auth.service';
import { CognitoAuthService } from './cognito/cognito-auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt-auth.strategy';
import { JwtRefreshTokenStrategy } from './jwt/jwt-auth-refresh.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user/user.service';
import { UserTypeService } from './user/user-type.service';
import KeyvRedis, { createCluster } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import config from '../../config';
import {
  User,
  UserRefreshToken,
  UserType,
  UserAssignRoles,
  Roles,
  UserOtp,
  UserLoginHistory,
  StudentAssignCourse,
  Student,
  Course,
  StudentOtp,
  StudentAssignRoles,
  StudentFollowup,
  AssignedStudent,
  StudentAcademicProfile,
} from '@smart-cloud-apps/common-api-lib';
import { UserLoginHistoryService } from './user/user-login-history.service';
import { StudentService } from './student/student.service';
import { ClientService } from './client/client.service';
import { RolesGuard } from './guards/roles.guard';
import {
  SMSService,
  SendGridEmailService,
} from '@smart-cloud-apps/common-api-lib';
import { PermissionController } from './roles-permission/permissions.controller';
import { StudentAcademicProfileService } from './student-academic-profile.service';
import { StudentAcademicProfileController } from './student-academic-profile.controller';
import { StudentSelfController } from './student-self.controller';
import { AssignedStudentService } from './assigned-student.service';
import { AssignedStudentController } from './assigned-student.controller';
// import { ProviderController } from './provider/provider.controller';
// import { ProviderService } from './provider/provider.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRefreshToken,
      UserType,
      UserAssignRoles,
      Roles,
      UserOtp,
      UserLoginHistory,
      Student,
      StudentAssignCourse,
      Course,
      StudentOtp,
      StudentAssignRoles,
      StudentFollowup,
      AssignedStudent,
      StudentAcademicProfile,
    ]),
    PassportModule,
    JwtModule.register({
      secret: config.JWT_ACCESS_SECRET,
      verifyOptions: {
        algorithms: ['RS256'],
      },
      signOptions: {
        expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
        algorithm: 'RS256',
      },
    }),
    CacheModule.registerAsync(
      config.ENABLE_CACHING
        ? // Enable caching if the config flag is set
          {
            useFactory: async () => {
              return {
                isGlobal: true,
                ttl: config.REDIS_TTL,
                stores: [
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
  controllers: [AuthController, PermissionController, AssignedStudentController, StudentAcademicProfileController, StudentSelfController],
  // controllers: [AuthController, ProviderController],
  providers: [
    AuthService,
    // ProviderService,
    JWTAuthService,
    CognitoAuthService,
    JwtService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    UserService,
    UserTypeService,
    UserLoginHistoryService,
    ConfigService,
    StudentService,
    ClientService,
    RolesGuard,
    SMSService,
    SendGridEmailService,
    AssignedStudentService,
    StudentAcademicProfileService,
  ],
  exports: [
    UserService,
    StudentService,
    RolesGuard,
  ],
})
export class AuthModule {}