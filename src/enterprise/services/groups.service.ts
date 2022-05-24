import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EnterpriseGroup } from '../entities/enterpriseGroup.entity';
import {
  CreateEnterpriseGroupDto,
  UpdateEnterpriseGroup,
} from '../dtos/enterpriseGroup.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(EnterpriseGroup)
    private enterpriseGroupRepo: Repository<EnterpriseGroup>,
  ) {}

  async getGroup(groupId: number) {
    const group = await this.enterpriseGroupRepo.findOne(groupId);

    if (!group) {
      return new NotFoundException('Group not found');
    }

    return group;
  }

  create(data: CreateEnterpriseGroupDto) {
    const group = this.enterpriseGroupRepo.create(data);

    return this.enterpriseGroupRepo.save(group);
  }

  async updateGroup(groupId: number, changes: UpdateEnterpriseGroup) {
    const group = await this.enterpriseGroupRepo.findOne(groupId);

    this.enterpriseGroupRepo.merge(group, changes);
    return this.enterpriseGroupRepo.save(group);
  }
}
