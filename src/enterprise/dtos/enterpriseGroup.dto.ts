import { IsString, IsNumber, IsOptional } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateEnterpriseGroupDto {
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly perimeter: string;

  @IsNumber()
  @ApiProperty()
  readonly enterpriseId: number;
}

export class UpdateEnterpriseGroup extends PartialType(CreateEnterpriseGroupDto) {}

export class AddEmployeeDto {
  @IsString()
  @ApiProperty()
  readonly email: string;

  @IsNumber()
  @ApiProperty()
  readonly enterpriseId: number;

  @IsNumber()
  @ApiProperty()
  readonly enterpriseGroupId: number;
}