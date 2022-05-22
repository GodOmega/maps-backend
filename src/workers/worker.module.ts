import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { WorkersGateway } from './workers.gateway'
import { WorkerService } from './services/worker.service';

import { Enterprise } from 'src/enterprise/entities/enterprise.entity';
import { Employe } from 'src/enterprise/entities/employe.entity';
import { EmployeTime } from 'src/enterprise/entities/employeTime.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Employe, Enterprise, EmployeTime])],
    providers: [WorkersGateway, WorkerService]
})
export class WorkerModule {}
