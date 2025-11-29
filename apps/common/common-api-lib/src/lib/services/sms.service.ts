import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import axios, { AxiosResponse } from 'axios';

export interface SMSMessage {
  to: string;
  templateId: string;
  [key: string]: string | number;
}

export interface MSG91Response {
  type: string;
  message: string;
}

@Injectable()
export class SMSService {
  private readonly msg91ApiKey: string;
  private readonly msg91SenderId: string;
  private readonly msg91BaseUrl: string = 'https://api.msg91.com/api/v5/flow/';

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger
  ) {
    this.msg91ApiKey = this.configService.get<string>('MSG91_API_KEY') || '';
    this.msg91SenderId = this.configService.get<string>('MSG91_SENDER_ID') || '';

    if (!this.msg91ApiKey) {
      this.logger.error('MSG91 API key is not configured');
      throw new Error('MSG91 API key is required');
    }

    if (!this.msg91SenderId) {
      this.logger.error('MSG91 Sender ID is not configured');
      throw new Error('MSG91 Sender ID is required');
    }
  }

  /**
   * Send SMS using MSG91 API with dynamic variables
   */
  async sendSMS(smsData: SMSMessage): Promise<MSG91Response> {
    try {
      const payload = {
        flow_id: smsData.templateId,
        sender: this.msg91SenderId,
        mobiles: `91${smsData.to}`,
        ...smsData
      };

      const response: AxiosResponse<MSG91Response> = await axios.post(
        this.msg91BaseUrl,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'authkey': this.msg91ApiKey,
            'accept': 'application/json'
          }
        }
      );

      this.logger.info(
        { 
          mobile: smsData.to, 
          templateId: smsData.templateId,
          type: response.data.type 
        },
        'SMS sent successfully'
      );

      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      this.logger.error(
        { 
          error: errorMessage, 
          mobile: smsData.to,
          templateId: smsData.templateId,
          stack: errorStack 
        },
        'Failed to send SMS'
      );
      
      throw new HttpException(
        'Failed to send SMS',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Send OTP SMS with dynamic variables
   */
  async sendOTPSMS(
    mobileNumber: string,
    templateId: string,
    variables: Record<string, string>
  ): Promise<MSG91Response> {
    const smsData: SMSMessage = {
      to: mobileNumber,
      templateId,
      ...variables,
    };

    return this.sendSMS(smsData);
  }
}
