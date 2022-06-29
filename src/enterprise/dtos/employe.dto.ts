import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

import { EmployeRole } from '../types/employe.type';

export class CreateEmployeeDto {
  @IsNumber()
  @ApiProperty()
  readonly enterpriseId: number;

  @IsNumber()
  @ApiProperty()
  readonly userId: number;

  @IsNumber()
  @ApiProperty()
  readonly enterpriseGroupId: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly role: EmployeRole;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}

export class CreateEmployeTimeDto {
  @IsString()
  readonly clientId: string;

  @IsNumber()
  readonly employeId: number;

  @IsString()
  @IsOptional()
  readonly role: string;
}

export class GetEmployeeTime {
  @IsString()
  @ApiProperty()
  readonly email: string;

  @IsNumber()
  @ApiProperty()
  readonly enterpriseId: number;
}

export class GetEmployeesWithTime {
  @IsNumber()
  @ApiProperty()
  readonly enterpriseId: number;
}

export class GetEmployeeTimeByWeek extends GetEmployeeTime{
  @IsDate()
  readonly startDate: Date;
  
  @IsDate()
  readonly endDate: Date;
}
