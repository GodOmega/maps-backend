import { IsString } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateEnterpriseDto {
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @ApiProperty()
  readonly coords: string;
}

export class UpdateEnterpriseDto extends PartialType(CreateEnterpriseDto) {}
