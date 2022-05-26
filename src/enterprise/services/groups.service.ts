import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConsoleLogger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EnterpriseGroup } from '../entities/enterpriseGroup.entity';
import { Employe } from '../entities/employe.entity';
import {
  CreateEnterpriseGroupDto,
  UpdateEnterpriseGroup,
  AddEmployeeDto,
} from '../dtos/enterpriseGroup.dto';

import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(EnterpriseGroup)
    private enterpriseGroupRepo: Repository<EnterpriseGroup>,
    @InjectRepository(Employe)
    private employeRepo: Repository<Employe>,
    private userService: UsersService,
  ) {}

  async getGroup(groupId: number) {
    const group = await this.enterpriseGroupRepo.findOne(groupId);

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  async getGroupEmployees(groupId: number) {
    return this.enterpriseGroupRepo.findOne(groupId, {
      relations: ['employees'],
    });
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

  async addEmployee(data: AddEmployeeDto) {
    const { email, enterpriseGroupId, enterpriseId } = data;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.employe && user.employe.enterpriseGroupId) {
      throw new BadRequestException('Usuario con grupo existente');
    }

    if (user.employe) {
      const employe = await this.employeRepo.findOne(user.employe.id);

      const changes = {
        enterpriseGroupId,
        enterpriseId,
      };

      this.employeRepo.merge(employe, changes);
      return this.employeRepo.save(employe);
    }

    const newEmployeeData = {
      ...data,
      userId: user.id
    }

    const newEmploye = this.employeRepo.create(newEmployeeData);
    return this.employeRepo.save(newEmploye);
  }

  async delete(groupId: number) {
    const group = await this.enterpriseGroupRepo.findOne(groupId, {
      relations: ['employees'],
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    for (const employee of group.employees) {
      const worker = await this.employeRepo.findOne(employee.id);

      if (worker) {
        const changes = {
          enterpriseGroupId: null,
        };
        this.employeRepo.merge(worker, changes);
        await this.employeRepo.save(worker);
      }
    }

    this.enterpriseGroupRepo.delete(groupId);
  }
}
