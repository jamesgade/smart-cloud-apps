import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginHistory} from '@smart-cloud-apps/common-api-lib'
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class UserLoginHistoryService {
  constructor(
    @InjectRepository(UserLoginHistory)
    private readonly userLoginHistoryRepository: Repository<UserLoginHistory>,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(UserLoginHistoryService.name);
  }

  async userLoginHistory(userId, req, log, status, studentId?) {
    const { headers, body, user } = req || {};

    const normalizeOrigin = (origin) =>
      origin?.replace(/^(https?|ftp):\/\//, '');

    const userAgent = headers?.['user-agent'];

    const isMobile =
      headers?.['sec-ch-ua-mobile'] === '1' ||
      (userAgent && userAgent.includes('Mobile'));

    const email = body?.username ?? user?.username;

    const logData = {
      userId,
      studentId,
      email,
      appName: body?.path,
      domain: normalizeOrigin(headers?.origin),
      ipAddress: headers?.['x-forwarded-for'],
      status,
      isMobile,
      userBrowserInfo: userAgent,
      log,
    };

    try {
      await this.userLoginHistoryRepository.insert(logData);
    } catch (error) {
      this.logger.error(
        { error: error.message, stack: error.stack },
        'Error inserting login history'
      );
    }
  }
}
