import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Student, User } from '@smart-cloud-apps/common-api-lib';
import config from '../../../config';

@Injectable()
export class JWTAuthService {
  constructor(private jwtService: JwtService) {}

  async getTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId: user.userId,
          username: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          sub: user.userId,
          userTypeId: user.userType.userTypeId,
          userTypeName: user.userType.name,
          roleId: user.userAssignRoles?.[0]?.roleId || null,
        },
        {
          secret: config.JWT_ACCESS_SECRET,
          expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
        }
      ),
      this.jwtService.signAsync(
        {
          userId: user.userId,
          username: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          sub: user.userId,
          userTypeId: user.userType.userTypeId,
          userTypeName: user.userType.name,
          roleId: user.userAssignRoles?.[0]?.roleId || null,
        },
        {
          secret: config.JWT_REFRESH_SECRET,
          expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getClientTokens(student: Student) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId: student.studentId,
          username: student.email,
          firstName: student.firstName,
          lastName: student.lastName,
          sub: student.studentId,
          userTypeId: student.userTypeId,
          userTypeName: 'Student',
          roleId: student.studentAssignRoles?.[0]?.roleId || null,
        },
        {
          secret: config.JWT_ACCESS_SECRET,
          expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
        }
      ),
      this.jwtService.signAsync(
        {
          userId: student.studentId,
          username: student.email,
          firstName: student.firstName,
          lastName: student.lastName,
          sub: student.studentId,
          userTypeId: student.userTypeId,
          userTypeName: 'Student',
          roleId: student.studentAssignRoles?.[0]?.roleId || null,
        },
        {
          secret: config.JWT_REFRESH_SECRET,
          expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}