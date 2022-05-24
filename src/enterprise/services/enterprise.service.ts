import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Enterprise } from '../entities/enterprise.entity';
import { EnterpriseGroup } from '../entities/enterpriseGroup.entity';
import {
  CreateEnterpriseDto,
  UpdateEnterpriseDto,
} from '../dtos/enterprise.dto';

@Injectable()
export class EnterpriseService {
  constructor(
    @InjectRepository(Enterprise)
    private enterpriseRepo: Repository<Enterprise>,
    @InjectRepository(EnterpriseGroup)
    private enterpriseGroupRepo: Repository<EnterpriseGroup>,
  ) {}

  async findOne(id: number) {
    const enterprise = await this.enterpriseRepo.findOne(id);

    if (!enterprise) {
      return new NotFoundException('Enterprise not found');
    }

    return enterprise;
  }

  create(data: CreateEnterpriseDto) {
    const enterprise = this.enterpriseRepo.create(data);
    return this.enterpriseRepo.save(enterprise);
  }

  async update(id: number, changes: UpdateEnterpriseDto) {
    const enterprise = await this.enterpriseRepo.findOne(id);

    this.enterpriseRepo.merge(enterprise, changes);
    return this.enterpriseRepo.save(enterprise);
  }
}
