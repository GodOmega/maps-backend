import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';
import { User } from '../../users/entities/user.entity';

import { RegisterUserDto } from '../dtos/registerUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  registerUser(@Body() payload: RegisterUserDto) {
    return this.authService.registerUser(payload);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  loginUser(@Req() req: Request) {
    const user = req.user as User;

    return this.authService.generateJWT(user);
  }
}
