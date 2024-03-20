import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}
  async createUser(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;

    const existingUser = await this.database.user.count({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser > 0) {
      throw new HttpException('Username or email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.database.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
    return {
      message: 'User created successfully',
      user,
    };
  }

  async findAll() {
    return this.database.user.findMany();
  }

  async getUserByEmail(email: string) {
    const user = await this.database.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async findOne(id: number) {
    const userById = await this.database.user.findUnique({
      where: {
        id,
      },
    });

    if (!userById) {
      throw new HttpException(`User with id ${id} not found`, 404);
    }

    return {
      message: 'User found successfully',
      data: userById,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.database.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      throw new HttpException("User doesn't exist", 404);
    }
    const updateData = await this.database.user.update({
      data: updateUserDto,
      where: {
        id,
      },
    });
    return {
      message: 'User updated successfully!',
      data: updateData,
    };
  }

  async remove(id: number) {
    const existingUser = await this.database.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      throw new HttpException("User doesn't exist", 404);
    }
    await this.database.user.delete({
      where: {
        id,
      },
    });

    return {
      message: 'User deleted successfully!',
    };
  }
}
