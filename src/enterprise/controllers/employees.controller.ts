import { Controller, Post, Body } from '@nestjs/common';


import { EmployeesService } from '../services/employees.service';


@Controller('employees')
export class EmployeesController {
  constructor(private employeService: EmployeesService) {}

  @Post()
  createEmploye(@Body() payload: any) {
    return this.employeService.create(payload)
  }
}
