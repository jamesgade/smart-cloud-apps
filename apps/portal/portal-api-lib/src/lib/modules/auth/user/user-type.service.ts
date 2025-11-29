import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserType } from '@smart-cloud-apps/common-api-lib';

@Injectable()
export class UserTypeService {
  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>
  ) {}

  async get(userTypeId: string) {
    return this.userTypeRepository.findOneBy({ userTypeId: userTypeId });
  }
}
