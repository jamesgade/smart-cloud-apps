import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uniq } from 'lodash';
import { Scholarship } from '@smart-cloud-apps/common-api-lib';
import { QueryOptions } from '@dataui/crud';
import { ParsedRequestParams } from '@dataui/crud-request';
import { CrudRequest } from '@dataui/crud';

@Injectable()
export class ScholarshipService extends TypeOrmCrudService<Scholarship> {
  override getSelect(query: ParsedRequestParams, options: QueryOptions) {
    return uniq(super.getSelect(query, options));
  }
  
  constructor(
    @InjectRepository(Scholarship)
    private readonly scholarshipRepository: Repository<Scholarship>
  ) {
    super(scholarshipRepository);
  }

  override async createOne(req: CrudRequest, dto: Partial<Scholarship>): Promise<Scholarship> {
    // Add audit fields for creation
    const entityToSave = {
      ...dto,
      createdBy: 'system', // You can get this from the request context or JWT
      updatedBy: 'system',
    };
    
    return super.createOne(req, entityToSave);
  }

  override async updateOne(req: CrudRequest, dto: Partial<Scholarship>): Promise<Scholarship> {
    // Add audit fields for update
    const entityToUpdate = {
      ...dto,
      updatedBy: 'system', // You can get this from the request context or JWT
    };
    
    return super.updateOne(req, entityToUpdate);
  }

  /**
   * Get scholarships by provider
   */
  async getScholarshipsByProvider(provider: string): Promise<Scholarship[]> {
    return this.scholarshipRepository.find({
      where: { provider, isActive: true },
      order: { scholarshipAmount: 'DESC' },
    });
  }

  /**
   * Get scholarships by education level
   */
  async getScholarshipsByEducationLevel(educationLevel: string): Promise<Scholarship[]> {
    return this.scholarshipRepository.find({
      where: { educationLevel, isActive: true },
      order: { scholarshipAmount: 'DESC' },
    });
  }

  /**
   * Search scholarships by name
   */
  async searchScholarshipsByName(searchTerm: string): Promise<Scholarship[]> {
    return this.scholarshipRepository
      .createQueryBuilder('scholarship')
      .where('scholarship.scholarshipName ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .andWhere('scholarship.isActive = :isActive', { isActive: true })
      .orderBy('scholarship.scholarshipAmount', 'DESC')
      .getMany();
  }

  /**
   * Get scholarships with high amounts
   */
  async getHighValueScholarships(limit: number = 10): Promise<Scholarship[]> {
    return this.scholarshipRepository.find({
      where: { isActive: true },
      order: { scholarshipAmount: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get scholarships by amount range
   */
  async getScholarshipsByAmountRange(minAmount: number, maxAmount: number): Promise<Scholarship[]> {
    return this.scholarshipRepository
      .createQueryBuilder('scholarship')
      .where('scholarship.scholarshipAmount >= :minAmount', { minAmount })
      .andWhere('scholarship.scholarshipAmount <= :maxAmount', { maxAmount })
      .andWhere('scholarship.isActive = :isActive', { isActive: true })
      .orderBy('scholarship.scholarshipAmount', 'DESC')
      .getMany();
  }
}
