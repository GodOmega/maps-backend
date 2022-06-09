import {
  Controller,
  Post,
  Body,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Get,
} from '@nestjs/common';

import { EmployeesService } from '../services/employees.service';

import { CreateEmployeeDto, UpdateEmployeeDto, GetEmployeeTime, GetEmployeesWithTime } from '../dtos/employe.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/roles.model';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private employeeService: EmployeesService) {}
  
  @Post('/time')
  getEmployeeTime(@Body() payload: GetEmployeeTime) {
    return this.employeeService.getEmployeeWithTime(payload);
  }

  @Post('/times')
  getEmployees(@Body() payload: GetEmployeesWithTime) {
    return this.employeeService.getEmployeesWithTime(payload);
  }
  

  @Get(':id')
  getEmployee(@Param('id', ParseIntPipe) employeeId: number) {
    return this.employeeService.findOne(employeeId);
  }


  @Post()
  createEmploye(@Body() payload: CreateEmployeeDto) {
    return this.employeeService.create(payload);
  }

  @Put(':id')
  updateEmploye(
    @Param('id', ParseIntPipe) employeeId: number,
    @Body() payload: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(employeeId, payload);
  }

  // @Roles(Role.ADMIN)
  @Delete(':id')
  deleteEmployee(@Param('id', ParseIntPipe) employeeId: number) {
    return this.employeeService.delete(employeeId);
  }
}
