import { IsString, IsNumber } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateEnterpriseDto {
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNumber()
  @ApiProperty()
  readonly userId: number;
}

export class UpdateEnterpriseDto extends PartialType(CreateEnterpriseDto) {}
