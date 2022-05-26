import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
  Req
} from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto, UpdateByUserDto } from '../dtos/users.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
// import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/roles.model';
import { User } from '../entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles(Role.ADMIN)
  @Post('email')
  findByEmail(@Body() payload: any) {
    const { email } = payload;
    return this.userService.findByEmail(email);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.userService.create(payload);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  updateByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ) {
    return this.userService.updateByAdmin(id, payload);
  }

  @Roles(Role.ADMIN, Role.WORKER, Role.OWNER)
  @Put('/update/:id')
  updateByUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateByUserDto,
    @Req() req: Request
  ) {
    const user = req.user
    return this.userService.updateByUser(id, payload, user);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
