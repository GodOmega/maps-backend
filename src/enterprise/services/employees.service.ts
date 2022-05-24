import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos/employe.dto';
import { Employe } from '../entities/employe.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employe) private employeRepo: Repository<Employe>,
  ) {}

  create(data: CreateEmployeeDto) {
    const employe = this.employeRepo.create(data);
    return this.employeRepo.save(employe);
  }

  async update(id: number, changes: UpdateEmployeeDto) {
    const employe = await this.employeRepo.findOne(id);
    this.employeRepo.merge(employe, changes);
  }
}
