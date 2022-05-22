import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EnterpriseGroup } from '../entities/enterpriseGroup.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(EnterpriseGroup)
    private enterpriseGroupRepo: Repository<EnterpriseGroup>,
  ) {}

  create(data: any) {
    const group = this.enterpriseGroupRepo.create(data);

    return this.enterpriseGroupRepo.save(group);
  }
}
