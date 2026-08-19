import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      omit: {
        password: true,
      },
    });
    return users;
  }

  async findOneByLogin(field: string) {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ login: field }, { email: field }],
      },
    });
  }
  async findOneById(id: number) {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });
  }

  async create(user: { email: string; login: string; password: string }) {
    return await this.prisma.user.create({
      data: {
        email: user.email,
        login: user.login,
        password: user.password,
      },
      omit: {
        password: true,
      },
    });
  }

  async update(
    userId: number,
    updateData: { login?: string; password?: string },
  ) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
      omit: {
        password: true,
      },
    });
  }
  async delete(userId: number) {
    return await this.prisma.user.delete({
      where: {
        id: userId,
      },
      omit: {
        password: true,
      },
    });
  }
}
