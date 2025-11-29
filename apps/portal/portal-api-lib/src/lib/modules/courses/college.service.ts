import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uniq } from 'lodash';
import { College } from '@smart-cloud-apps/common-api-lib';
import { QueryOptions } from '@dataui/crud';
import { ParsedRequestParams } from '@dataui/crud-request';
import { CrudRequest } from '@dataui/crud';

@Injectable()
export class CollegeService extends TypeOrmCrudService<College> {
  override getSelect(query: ParsedRequestParams, options: QueryOptions) {
    return uniq(super.getSelect(query, options));
  }
  
  constructor(
    @InjectRepository(College)
    private readonly collegeRepository: Repository<College>
  ) {
    super(collegeRepository);
  }

  override async createOne(req: CrudRequest, dto: Partial<College>): Promise<College> {
    // Add audit fields for creation
    const entityToSave = {
      ...dto,
      createdBy: 'system', // You can get this from the request context or JWT
      updatedBy: 'system',
    };
    
    return super.createOne(req, entityToSave);
  }

  override async updateOne(req: CrudRequest, dto: Partial<College>): Promise<College> {
    // Add audit fields for update
    const entityToUpdate = {
      ...dto,
      updatedBy: 'system', // You can get this from the request context or JWT
    };
    
    return super.updateOne(req, entityToUpdate);
  }

  /**
   * Get colleges by state
   */
  async getCollegesByState(state: string): Promise<College[]> {
    return this.collegeRepository.find({
      where: { state, isActive: true },
      order: { name: 'ASC' },
    });
  }

  /**
   * Get colleges by type (Engineering, Medical, etc.)
   */
  async getCollegesByType(type: string): Promise<College[]> {
    return this.collegeRepository.find({
      where: { type, isActive: true },
      order: { rating: 'DESC' },
    });
  }

  /**
   * Search colleges by name (includes both active and inactive)
   */
  async searchCollegesByName(searchTerm: string, includeInactive: boolean = true): Promise<College[]> {
    const queryBuilder = this.collegeRepository
      .createQueryBuilder('college')
      .where('college.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` });
    
    // Only filter by isActive if we don't want inactive colleges
    if (!includeInactive) {
      queryBuilder.andWhere('college.isActive = :isActive', { isActive: true });
    }
    
    return queryBuilder
      .orderBy('college.name', 'ASC')
      .getMany();
  }

  /**
   * Get colleges with student assignment counts
   */
  async getCollegesWithStudentCounts() {
    return this.collegeRepository
      .createQueryBuilder('college')
      .leftJoinAndSelect('college.studentAssignedColleges', 'assignments')
      .where('college.isActive = :isActive', { isActive: true })
      .groupBy('college.collegeId')
      .orderBy('college.name', 'ASC')
      .getMany();
  }

  /**
   * Get top-rated colleges
   */
  async getTopRatedColleges(limit: number = 10): Promise<College[]> {
    return this.collegeRepository.find({
      where: { isActive: true },
      order: { rating: 'DESC' },
      take: limit,
    });
  }
}