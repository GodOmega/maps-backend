import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';
import { Employe } from 'src/enterprise/entities/employe.entity';
import { OwnerController } from './controllers/owner.controller';
import { OwnerService } from './services/owner.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Employe])],
  controllers: [UsersController, OwnerController],
  providers: [UsersService, OwnerService],
  exports: [UsersService],
})
export class UsersModule {}
