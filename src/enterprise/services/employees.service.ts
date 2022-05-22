import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employe } from '../entities/employe.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employe) private employeRepo: Repository<Employe>,
  ) {}

  create(data: any) {
    const employe = this.employeRepo.create(data);

    return this.employeRepo.save(employe);
  }
}
