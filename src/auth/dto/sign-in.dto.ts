import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsEmail(undefined, { message: 'Please enter a valid email' })
  email: string;
  @IsString()
  password: string;
}
