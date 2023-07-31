import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(user: CreateUserDto) {
    if (await this.findByEmail(user.email))
      throw new HttpException('this user already exists', HttpStatus.CONFLICT);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
      await this.prisma.users.create({
        data: user,
      });
      return user.name;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll() {
    try {
      return await this.prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.users.findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      if (user) return user;

      throw new Error('user not found');
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async update(id: string, newData: UpdateUserDto) {
    try {
      if (await this.findOne(id)) {
        await this.prisma.users.update({
          where: {
            id: id,
          },
          data: newData,
        });
        return newData;
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: string) {
    try {
      if (await this.findOne(id))
        await this.prisma.users.delete({
          where: { id: id },
        });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  private async findByEmail(email: string): Promise<boolean> {
    try {
      const user = await this.prisma.users.findFirst({
        where: {
          email: email,
        },
      });

      if (user) return true;

      return false;
    } catch (error) {
      throw new Error(error);
    }
  }
}
