import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { userSession } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUser(email: string): Promise<userSession | null> {
    return await this.prisma.userSession.findUnique({
      where: {
        email: email,
      },
    });
  }

  async updateUserToken(email: string, token: string): Promise<userSession> {
    return await this.prisma.userSession.update({
      where: {
        email: email,
      },
      data: {
        token: token,
      },
    });
  }

  async createUser(email: string, token: string): Promise<userSession> {
    return await this.prisma.userSession.create({
      data: {
        email: email,
        token: token,
      },
    });
  }

  async findUserByToken(token: string): Promise<userSession | null> {
    return this.prisma.userSession.findUnique({
      where: { token },
    });
  }
}
