import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnterprisesController } from './controllers/enterprises.controller';
import { EnterpriseService } from './services/enterprise.service';
import { Enterprise } from './entities/enterprise.entity';
import { Employe } from './entities/employe.entity';

import { User } from 'src/users/entities/user.entity';
import { EmployeTime } from './entities/employeTime.entity';
import { EnterpriseGroup } from './entities/enterpriseGroup.entity';
import { GroupsController } from './controllers/groups.controller';
import { GroupsService } from './services/groups.service';
import { EmployeesController } from './controllers/employees.controller';
import { EmployeesService } from './services/employees.service';

import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Enterprise,
      Employe,
      User,
      EmployeTime,
      EnterpriseGroup,
    ]),
    UsersModule,
  ],
  controllers: [EnterprisesController, GroupsController, EmployeesController],
  providers: [EnterpriseService, GroupsService, EmployeesService],
})
export class EnterpriseModule {}
