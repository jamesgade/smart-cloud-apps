import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { StudentService } from '../student/student.service';
import { User } from '@smart-cloud-apps/common-api-lib';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private readonly userService: UserService,
    private readonly studentService: StudentService
  ) {
    super({
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload): Promise<any> {
    const { username, userTypeName, userId } = payload;

    // Check if this is a student based on userTypeName in JWT
    if (userTypeName === 'Student') {
      try {
        const student = await this.studentService.studentDataWithEmail(username);
        if (!student) {
          throw new UnauthorizedException('Student not authorized');
        }
        
        // Return the payload with the correct userId
        return {
          ...payload,
          userId: payload.userId || student.studentId
        };
      } catch (error) {
        console.error('Student validation failed:', error);
        throw new UnauthorizedException('Student not authorized');
      }
    } else {
      // Regular user validation
      try {
        const user: User = await this.userService.findByEmailData(username);
        if (!user) {
          throw new UnauthorizedException('User not authorized');
        }
        // Return the payload with the correct userId
        return {
          ...payload,
          userId: payload.userId || user.userId
        };
      } catch (error) {
        console.error('User validation failed:', error);
        throw new UnauthorizedException('User not authorized');
      }
    }
  }
}