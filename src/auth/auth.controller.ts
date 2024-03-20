import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { jwt } = await this.authService.signIn(signInDto);
    res
      .cookie('refresh_token', jwt.refresh_token, { httpOnly: true })
      .json(jwt);
    // return {
    //   jwt,
    // };
  }

  @Get('/refresh-token')
  getRefreshToken() {
    return 'Refresh Token';
  }
}
