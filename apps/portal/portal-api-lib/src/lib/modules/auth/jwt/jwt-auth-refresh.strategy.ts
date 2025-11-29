import {
  HttpStatus,
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@smart-cloud-apps/common-api-lib';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(
    private configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(@Req() req: Request, payload: any): Promise<User> {
    const refreshToken = req.headers['authorization']
      .replace('Bearer', '')
      .trim();
    const identifier = req.headers['sessionidentifier'];
    return { ...payload, refreshToken, identifier };
  }
}
