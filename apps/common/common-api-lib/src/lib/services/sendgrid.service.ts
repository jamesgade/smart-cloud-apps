import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailDataRequired, MailService } from '@sendgrid/mail';
import sgMail = require('@sendgrid/mail');
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class SendGridEmailService {
  private readonly mail: MailService;
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger
  ) {
    const sendgridApiKey =
      this.configService.get<string>('SENDGRID_API_KEY') || '';
    // Validate the API key
    if (
      !sendgridApiKey ||
      typeof sendgridApiKey !== 'string' ||
      !sendgridApiKey.startsWith('SG.')
    ) {
      this.logger.error(
        { error: 'Invalid or missing SendGrid API key in configuration' },
        'SendGrid'
      );
      throw new Error('Invalid or missing SendGrid API key in configuration');
    }
    sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
    this.mail = sgMail;
  }
  async sendEmail(
    email: string[],
    templateId: string,
    dynamicData: object,
    senderName?: string,
    cc_mails = [],
    bcc_mails = []
  ): Promise<void> {
    const sendGridFromMail =
      this.configService.get<string>('SENDGRID_SENDER_EMAIL') || '';

    const defaultSenderName = 'SS';
    const mailSenderName = senderName?.toUpperCase() || defaultSenderName;

    const mailSenderEmail = sendGridFromMail;

    const msg = {
      to: email,
      cc: cc_mails,
      bcc: bcc_mails,
      from: {
        name: mailSenderName,
        email: mailSenderEmail,
      },
      templateId: templateId,
      dynamic_template_data: dynamicData,
    };
    try {
      await this.mail.send(msg);
    } catch (error) {
      this.logger.error(
        { error: error.message, stack: error.stack },
        'Mail not sent.'
      );
      throw new HttpException(
        'Mail not sent.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
