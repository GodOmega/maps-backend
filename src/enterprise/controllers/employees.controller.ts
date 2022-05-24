import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { EmployeesService } from '../services/employees.service';

import { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos/employe.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private employeeService: EmployeesService) {}

  @Post()
  createEmploye(@Body() payload: CreateEmployeeDto) {
    return this.employeeService.create(payload);
  }

  @Put(':id')
  updateEmploye(
    @Param('id', ParseIntPipe) employeeId: number,
    @Body() payload: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(employeeId ,payload)
  }
}
