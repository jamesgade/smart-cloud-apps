import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uniq } from 'lodash';
import { Course } from '@smart-cloud-apps/common-api-lib';
import { QueryOptions } from '@dataui/crud';
import { ParsedRequestParams } from '@dataui/crud-request';

@Injectable()
export class CourseService extends TypeOrmCrudService<Course> {
  override getSelect(query: ParsedRequestParams, options: QueryOptions) {
    return uniq(super.getSelect(query, options));
  }
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>
  ) {
    super(courseRepository);
  }
}