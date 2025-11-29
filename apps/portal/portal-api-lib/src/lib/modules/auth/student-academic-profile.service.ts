import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentAcademicProfile } from '@smart-cloud-apps/common-api-lib';

@Injectable()
export class StudentAcademicProfileService {
  constructor(
    @InjectRepository(StudentAcademicProfile)
    private readonly repo: Repository<StudentAcademicProfile>
  ) {}

  async getByStudentId(studentId: string) {
    const profile = await this.repo.findOne({ where: { studentId } });
    return profile || { studentId };
  }

  async upsert(studentId: string, data: Partial<StudentAcademicProfile>) {
    const existing = await this.repo.findOne({ where: { studentId } });
    if (existing) {
      await this.repo.update({ studentId }, { ...data, updatedBy: data.updatedBy || 'SYSTEM' } as any);
      return await this.repo.findOne({ where: { studentId } });
    }
    return await this.repo.save({ ...data, studentId, createdBy: data.createdBy || 'SYSTEM', updatedBy: data.updatedBy || 'SYSTEM' } as any);
  }
}


