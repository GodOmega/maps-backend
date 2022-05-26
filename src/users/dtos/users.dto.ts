import { IsString, IsEmail, IsOptional } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

import { USER_GENDER, USER_ROLE } from '../models/user.models';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly username: string;

  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @ApiProperty()
  readonly lastname: string;

  @IsString()
  @ApiProperty()
  readonly password: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly role: USER_ROLE;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly gender: USER_GENDER;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
