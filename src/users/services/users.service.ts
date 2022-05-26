import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';

import {
  CreateUserDto,
  UpdateUserDto,
  UpdateByUserDto,
} from '../dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  findAll() {
    return this.userRepo.find();
  }

  async findByEmail(email: string) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .leftJoinAndSelect('user.employe', 'employe')
      .leftJoinAndSelect('user.enterprises', 'enterprises')
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(data: CreateUserDto) {
    const newUser = this.userRepo.create(data);
    const hashPassword = await bcrypt.hash(newUser.password, 10);

    newUser.password = hashPassword;

    return this.userRepo.save(newUser);
  }

  async updateByAdmin(id: number, changes: UpdateUserDto) {
    const user = await this.userRepo.findOne(id);

    if (!user) {
      throw new NotFoundException('User not Found');
    }

    const { password } = changes;

    const userData = {
      ...changes,
      password: user.password,
    };

    this.userRepo.merge(user, userData);

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    return this.userRepo.save(user);
  }

  async updateByUser(id: number, changes: UpdateByUserDto, loggedUser) {
    const user = await this.userRepo.findOne(id);

    if (!user) {
      throw new NotFoundException('User not Found');
    }

    if (loggedUser.sub !== user.id) {
      throw new UnauthorizedException(
        'No estas autorizado para realizar esta accion',
      );
    }

    const { password } = changes;

    const userData = {
      ...changes,
      password: user.password,
    };

    this.userRepo.merge(user, userData);
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    return this.userRepo.save(user);
  }

  delete(id: number) {
    return this.userRepo.delete(id);
  }
}
