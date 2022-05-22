import { IsString, IsNumber, IsOptional } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateEnterpriseGroupDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly perimeter: string;

  @IsNumber()
  readonly employeId: number;

  @IsNumber()
  readonly enterpriseId: number;
}
