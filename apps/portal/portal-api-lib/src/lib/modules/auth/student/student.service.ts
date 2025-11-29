import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '@smart-cloud-apps/common-api-lib';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>
  ) {}

  async studentDataWithPhoneNumber(phoneNumber: string) {
    return this.studentRepository
      .createQueryBuilder('student')
      .innerJoinAndSelect('student.studentAssignCourse', 'studentAssignCourse')
      .innerJoinAndSelect('studentAssignCourse.course', 'course')
      .innerJoinAndSelect('student.studentAssignRoles', 'studentAssignRoles')
      .where('student.mobilePhone = :phoneNumber', { phoneNumber })
      .getOne();
  }

  async studentDataWithEmail(email: string) {
    return this.studentRepository
      .createQueryBuilder('student')
      .innerJoinAndSelect('student.studentAssignRoles', 'studentAssignRoles')
      .where('student.email = :email', { email })
      .getOne();
  }
}