import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindCondition, Like } from 'typeorm';

import { Enterprise } from '../entities/enterprise.entity';
import {
  CreateEnterpriseDto,
  UpdateEnterpriseDto,
  FilterEnterpriseDto,
  RemoveEmployee,
} from '../dtos/enterprise.dto';
import { Employe } from '../entities/employe.entity';

@Injectable()
export class EnterpriseService {
  constructor(
    @InjectRepository(Enterprise)
    private enterpriseRepo: Repository<Enterprise>,
    @InjectRepository(Employe)
    private EmployeRepo: Repository<Employe>,
  ) {}

  findAll(params?: FilterEnterpriseDto) {
    if (params) {
      const where: FindCondition<Enterprise> = {};
      const { name } = params;

      if (name) {
        where.name = Like(`%${name}%`);
      }

      return this.enterpriseRepo.find({
        relations: ['user'],
        where,
      });
    }

    return this.enterpriseRepo.find({
      relations: ['user'],
    });
  }

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

  async removeEmployee(data: RemoveEmployee) {
    const employee = await this.EmployeRepo.findOne({
      where: {
        enterpriseId: data.enterpriseId,
        id: data.employeeId,
      },
    });

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    return this.EmployeRepo.delete(employee.id);
  }

  delete(id: number) {
    return this.enterpriseRepo.delete(id);
  }
}
