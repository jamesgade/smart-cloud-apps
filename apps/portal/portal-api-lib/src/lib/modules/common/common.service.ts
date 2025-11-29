import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Roles } from '@smart-cloud-apps/common-api-lib';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>
  ) {}

  async getRolesExcludingStudent(): Promise<Roles[]> {
    return await this.rolesRepository.find({
      where: {
        title: Not('Student'),
      },
      order: {
        orderBy: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<Roles | null> {
    return await this.rolesRepository.findOne({
      where: { id },
    });
  }
}