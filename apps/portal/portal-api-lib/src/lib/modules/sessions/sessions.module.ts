import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { TwilioService } from './twilio.service';
import { Session, SessionStatus, Appointment, AppointmentStatus } from '@smart-cloud-apps/common-api-lib';

@Module({
  imports: [TypeOrmModule.forFeature([Session, SessionStatus, Appointment, AppointmentStatus])],
  controllers: [SessionsController],
  providers: [SessionsService, TwilioService],
  exports: [SessionsService, TwilioService],
})
export class SessionsModule {}

