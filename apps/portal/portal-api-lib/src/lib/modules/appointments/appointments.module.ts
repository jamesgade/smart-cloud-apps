import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment, AppointmentStatus, User } from '@smart-cloud-apps/common-api-lib';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, AppointmentStatus, User])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}

