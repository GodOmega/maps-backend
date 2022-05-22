import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnterprisesController } from './controllers/enterprises.controller';
import { EnterpriseService } from './services/enterprise.service';
import { Enterprise } from './entities/enterprise.entity';
import { Employe } from './entities/employe.entity';

import { User } from 'src/users/entities/user.entity';
import { EmployeTime } from './entities/employeTime.entity';
import { EnterpriseGroup } from './entities/enterpriseGroup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enterprise, Employe, User, EmployeTime, EnterpriseGroup])],
  controllers: [EnterprisesController],
  providers: [EnterpriseService],
})
export class EnterpriseModule {}
