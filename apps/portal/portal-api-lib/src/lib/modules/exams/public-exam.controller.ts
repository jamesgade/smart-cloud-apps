import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '@smart-cloud-apps/common-api-lib';

@Controller('public/exams')
export class PublicExamController {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>
  ) {}

  @Get()
  async list(@Query('category') category?: string) {
    const qb = this.examRepository.createQueryBuilder('exam')
      .where('exam.isActive = :active', { active: true })
      .orderBy('exam.name', 'ASC');
    if (category) {
      qb.andWhere('exam.category = :category', { category });
    }
    return await qb.getMany();
  }
}


