import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class OwnerService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
}
