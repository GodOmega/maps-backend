import { IsString, IsNumber } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateEmployeTimeDto {
  @IsString()
  readonly clientId: string;

  @IsNumber()
  readonly employeId: number;
}
