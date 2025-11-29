import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CollegeService } from './college.service';
import { StudentAssignedCollegeService } from './student-assigned-college.service';
import { CollegeController } from './college.controller';
import { StudentAssignedCollegeController } from './student-assigned-college.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course, College, StudentAssignedCollege, Application, Student } from '@smart-cloud-apps/common-api-lib';

@Module({
  imports: [TypeOrmModule.forFeature([Course, College, StudentAssignedCollege, Application, Student])],
  controllers: [CollegeController, StudentAssignedCollegeController],
  providers: [CourseService, CollegeService, StudentAssignedCollegeService],
  exports: [CourseService, CollegeService, StudentAssignedCollegeService],
})
export class CourseModule {}