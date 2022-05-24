import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


import { USER_GENDER } from 'src/users/models/user.models';

export class RegisterUserDto {
  @IsString()
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
  readonly gender: USER_GENDER;

  @IsString()
  @ApiProperty()
  readonly password: string;
}
