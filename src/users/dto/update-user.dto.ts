import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username: string;
  @IsString()
  @IsOptional()
  @IsEmail(undefined, { message: 'Please enter a valid email' })
  email: string;
  @IsString()
  @IsOptional()
  password: string;
}
