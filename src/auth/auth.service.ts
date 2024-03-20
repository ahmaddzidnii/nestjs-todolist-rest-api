import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly database: DatabaseService,
    private readonly usersService: UsersService,
  ) {}
  async signUp(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new HttpException('User with this email not found', 404);
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new HttpException('Invalid credentials', 400);
    }

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const accsess_token = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_ACCSESS_TOKEN_SECRET,
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    });

    return {
      jwt: {
        access_token: accsess_token,
        refresh_token: refresh_token,
      },
    };
  }
}
