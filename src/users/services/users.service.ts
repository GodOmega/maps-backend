import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';

import { CreateUserDto } from '../dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  findByEmail(email: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .leftJoinAndSelect('user.employe', 'employe')
      .leftJoinAndSelect('user.enterprises', 'enterprises')
      .getOne();
  }

  async create(data: CreateUserDto) {
    const newUser = this.userRepo.create(data);
    const hashPassword = await bcrypt.hash(newUser.password, 10);

    newUser.password = hashPassword;

    return this.userRepo.save(newUser);
  }
}
