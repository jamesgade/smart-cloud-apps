import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from '@smart-cloud-apps/common-api-lib';
import { ExamController } from './exam.controller';
import { PublicExamController } from './public-exam.controller';
import { ExamService } from './exam.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exam])],
  controllers: [ExamController, PublicExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamsModule {}


