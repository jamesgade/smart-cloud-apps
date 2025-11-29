import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scholarship } from '@smart-cloud-apps/common-api-lib';
import { ScholarshipService } from './scholarship.service';
import { ScholarshipController } from './scholarship.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Scholarship])],
  providers: [ScholarshipService],
  controllers: [ScholarshipController],
  exports: [ScholarshipService],
})
export class ScholarshipModule {}
