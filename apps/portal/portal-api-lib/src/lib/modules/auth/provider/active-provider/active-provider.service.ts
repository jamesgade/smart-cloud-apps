import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PinoLogger } from 'nestjs-pino';
import { User } from '@smart-cloud-apps/common-api-lib';

interface AuthResponse {
  token: string;
  user_email?: string;
  user_nicename?: string;
  user_display_name?: string;
}

interface AuthResult {
  token?: string;
  message?: string;
}

@Injectable()
export class ActiveProviderService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(ActiveProviderService.name);
  }

  async getActiveProviderUser(token: any, req: any) {
    const verify_token = await this.verifyToken(token);
    const userId = verify_token.sub;
    const userInfo = await this.userRepository
      .createQueryBuilder('user')
      .select(['user'])
      .where('user.userId = :id', { id: userId })
      .getOne();
    if (!userInfo) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    } else if (userInfo.status == 'INVITATION-SENT') {
      const email = userInfo.email.toLocaleLowerCase();
      const user_name = `${userInfo.firstName} ${userInfo.lastName}`;
      const userName = user_name
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return { email, userName };
    } else if (userInfo.status == 'ACTIVE') {
      throw new HttpException('User is already active', HttpStatus.FOUND);
    } else {
      throw new HttpException('Link Expired', HttpStatus.BAD_REQUEST);
    }
  }

  async activeProviderUser(token: any, dto: any, req: any) {
    const verify_token = await this.verifyToken(token);
    const userId = verify_token.sub;
    const userInfo = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userType', 'userType')
      .innerJoinAndSelect('user.userAssignRoles', 'assignRoles')
      .innerJoinAndSelect('assignRoles.role', 'roles')
      .where('user.userId = :id', { id: userId })
      .getOne();

    if (!userInfo) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    } else if (userInfo.status == 'ACTIVE') {
      throw new HttpException('User is already active', HttpStatus.BAD_REQUEST);
    } else if (userInfo.status === 'INVITATION-SENT') {
      const email = userInfo.email.toLocaleLowerCase();
      const userType = userInfo.userType?.name;
      const userName = `${userInfo.firstName} ${userInfo.lastName}`;
      
      // Hash the password using bcrypt
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
      
      // Update user status and password in database
      await this.userRepository
        .createQueryBuilder('user')
        .update(User)
        .set({
          updatedBy: userId,
          updatedAt: new Date(),
          status: 'ACTIVE',
          password: hashedPassword,
        })
        .where('email = :email', { email: userInfo?.email })
        .execute();
        
      return {
        message: `User ${userId} Setup completed`,
        status: HttpStatus.OK,
      };
    } else {
      throw new HttpException('Link Expired', HttpStatus.BAD_REQUEST);
    }
  }


  async verifyToken(token: any) {
    try {
      const verify_token = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_USER_INVITE_ACCESS_SECRET'),
      });
      return verify_token;
    } catch (error: any) {
      this.logger.error(
        { error: error.message, stack: error.stack },
        `Token verification failed`
      );
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
