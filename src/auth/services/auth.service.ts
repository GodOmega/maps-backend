import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';

import { CreateUserDto } from '../../users/dtos/users.dto';
import { UsersService } from '../../users/services/users.service';
import { PayloadToken } from '../models/token.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerUser(data: CreateUserDto) {
    return await this.usersService.create(data);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      }
    }

    return null;
  }

  generateJWT(user: User) {
    const payload: PayloadToken = { role: user.role, sub: user.id };
    return {
      acces_token: this.jwtService.sign(payload),
      user,
    };
  }
}
