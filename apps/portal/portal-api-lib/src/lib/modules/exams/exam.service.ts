import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '@smart-cloud-apps/common-api-lib';
import { CrudRequest } from '@dataui/crud';

@Injectable()
export class ExamService extends TypeOrmCrudService<Exam> {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>
  ) {
    super(examRepository);
  }

  // Ensure audit fields are populated
  override async createOne(req: CrudRequest, dto: Partial<Exam>): Promise<Exam> {
    const entityToSave = {
      ...dto,
      createdBy: 'system',
      updatedBy: 'system',
    } as any;
    return super.createOne(req, entityToSave);
  }

  override async updateOne(req: CrudRequest, dto: Partial<Exam>): Promise<Exam> {
    const entityToUpdate = {
      ...dto,
      updatedBy: 'system',
    } as any;
    return super.updateOne(req, entityToUpdate);
  }
}


